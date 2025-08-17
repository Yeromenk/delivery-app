import pool from '../database/db';
import { calcCartItemTotalPrice } from './calc-cart-item-total-price'

export const updateCartTotalAmount = async (token: string) => {
    const client = await pool.connect();

    try {
        // Get cart with all items
        const result = await client.query(`
            SELECT
                c.id as cart_id,
                c."totalAmount",
                c.token,
                COALESCE(
                    json_agg(
                        jsonb_build_object(
                            'id', ci.id,
                            'quantity', ci.quantity,
                            'productItem', jsonb_build_object(
                                'id', pi.id,
                                'price', pi.price,
                                'size', pi.size,
                                'pizzaType', pi."pizzaType",
                                'product', jsonb_build_object(
                                    'id', p.id,
                                    'name', p.name,
                                    'imageUrl', p."imageUrl"
                                )
                            ),
                            'ingredients', COALESCE(ci_ingredients.ingredients, '[]'::json)
                        )
                    ) FILTER (WHERE ci.id IS NOT NULL),
                    '[]'
                ) as items
            FROM "Cart" c
            LEFT JOIN "CartItem" ci ON c.id = ci."cartId"
            LEFT JOIN "ProductItem" pi ON ci."productItemId" = pi.id
            LEFT JOIN "Product" p ON pi."productId" = p.id
            LEFT JOIN (
                SELECT
                    ci_inner.id as cart_item_id,
                    json_agg(
                        jsonb_build_object(
                            'id', i.id,
                            'name', i.name,
                            'price', i.price
                        )
                    ) as ingredients
                FROM "CartItem" ci_inner
                LEFT JOIN "_CartItemToIngredient" citi ON ci_inner.id = citi."A"
                LEFT JOIN "Ingredient" i ON citi."B" = i.id
                WHERE i.id IS NOT NULL
                GROUP BY ci_inner.id
            ) ci_ingredients ON ci.id = ci_ingredients.cart_item_id
            WHERE c.token = $1
            GROUP BY c.id, c."totalAmount", c.token
        `, [token]);

        if (result.rows.length === 0) {
            return null;
        }

        const cart = result.rows[0];

        // Calculate total amount
        const totalAmount = cart.items.reduce((acc: number, item: any) => {
            return acc + calcCartItemTotalPrice(item);
        }, 0);

        // Update cart total
        await client.query(`
            UPDATE "Cart" 
            SET "totalAmount" = $1 
            WHERE token = $2
        `, [totalAmount, token]);

        // Return updated cart
        const updatedResult = await client.query(`
            SELECT
                c.id as cart_id,
                c."totalAmount",
                c.token,
                COALESCE(
                    json_agg(
                        jsonb_build_object(
                            'id', ci.id,
                            'quantity', ci.quantity,
                            'createdAt', ci."createdAt",
                            'productItem', jsonb_build_object(
                                'id', pi.id,
                                'price', pi.price,
                                'size', pi.size,
                                'pizzaType', pi."pizzaType",
                                'product', jsonb_build_object(
                                    'id', p.id,
                                    'name', p.name,
                                    'imageUrl', p."imageUrl",
                                    'categoryId', p."categoryId"
                                )
                            ),
                            'ingredients', COALESCE(ci_ingredients.ingredients, '[]'::json)
                        )
                        ORDER BY ci."createdAt" DESC
                    ) FILTER (WHERE ci.id IS NOT NULL),
                    '[]'
                ) as items
            FROM "Cart" c
            LEFT JOIN "CartItem" ci ON c.id = ci."cartId"
            LEFT JOIN "ProductItem" pi ON ci."productItemId" = pi.id
            LEFT JOIN "Product" p ON pi."productId" = p.id
            LEFT JOIN (
                SELECT
                    ci_inner.id as cart_item_id,
                    json_agg(
                        jsonb_build_object(
                            'id', i.id,
                            'name', i.name,
                            'price', i.price,
                            'imageUrl', i."imageUrl"
                        )
                    ) as ingredients
                FROM "CartItem" ci_inner
                LEFT JOIN "_CartItemToIngredient" citi ON ci_inner.id = citi."A"
                LEFT JOIN "Ingredient" i ON citi."B" = i.id
                WHERE i.id IS NOT NULL
                GROUP BY ci_inner.id
            ) ci_ingredients ON ci.id = ci_ingredients.cart_item_id
            WHERE c.token = $1
            GROUP BY c.id, c."totalAmount", c.token
        `, [token]);

        return updatedResult.rows[0];
    } finally {
        client.release();
    }
};