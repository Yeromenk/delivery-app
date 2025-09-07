import { Router, Request, Response } from 'express';
import pool from '../database/db';
import cookie from 'cookie';
import { SendEmail } from '../lib/send-email';
const router = Router();
import { stripe } from '../lib/stripe';

// Pricing constants
const VAT_RATE = 15; // 15%
const DELIVERY_PRICE = 50; // 50 CZK

interface CreateOrderBody {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    address: string;
    comment?: string;
}

function extractCartToken(req: Request): string | undefined {
    const headerToken = req.header('x-cart-token');
    if (headerToken) return headerToken;

    const rawCookie = req.headers.cookie;
    if (rawCookie) {
        const parsed = cookie.parse(rawCookie);
        if (parsed.cartToken) return parsed.cartToken;
    }
    if (typeof req.body?.cartToken === 'string') return req.body.cartToken;
    return undefined;
}

router.post('/orders', async (req: Request, res: Response) => {
    const {
        firstName,
        lastName,
        phone,
        email,
        address,
        comment,
    } = (req.body || {}) as CreateOrderBody;

    if (!firstName || !lastName || !phone || !email || !address) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const cartToken = extractCartToken(req);
    if (!cartToken) {
        return res.status(400).json({ message: 'Cart token not found' });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const cartResult = await client.query(
            `SELECT * FROM "Cart" WHERE token = $1 FOR UPDATE`,
            [cartToken],
        );
        if (cartResult.rowCount === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'Cart not found' });
        }
        const cart = cartResult.rows[0];

        if (!cart.totalAmount || Number(cart.totalAmount) === 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'Cart is empty' });
        }

        const itemsResult = await client.query(
            `
                SELECT
                    ci.id               AS "cartItemId",
                    ci.quantity,
                    pi.id               AS "productItemId",
                    pi.price            AS "basePrice",
                    pi.size,
                    pi."pizzaType",
                    p.id                AS "productId",
                    p.name              AS "productName",
                    p."imageUrl"        AS "productImageUrl",
                    COALESCE(
                                    json_agg(
                                    DISTINCT CASE
                                                 WHEN ing.id IS NULL THEN NULL
                                                 ELSE jsonb_build_object(
                                                         'id', ing.id,
                                                         'name', ing.name,
                                                         'price', ing.price,
                                                         'imageUrl', ing."imageUrl"
                                                      )
                                        END
                                            ) FILTER (WHERE ing.id IS NOT NULL),
                                    '[]'
                    ) AS ingredients
                FROM "CartItem" ci
                         JOIN "ProductItem" pi ON pi.id = ci."productItemId"
                         JOIN "Product" p ON p.id = pi."productId"
                         LEFT JOIN "_CartItemToIngredient" cti ON cti."A" = ci.id
                         LEFT JOIN "Ingredient" ing ON ing.id = cti."B"
                WHERE ci."cartId" = $1
                GROUP BY ci.id, pi.id, p.id
                ORDER BY ci.id
            `,
            [cart.id],
        );

        const serializedItems = itemsResult.rows.map((r) => ({
            cartItemId: r.cartItemId,
            quantity: r.quantity,
            productItemId: r.productItemId,
            basePrice: r.basePrice,
            size: r.size,
            pizzaType: r.pizzaType,
            product: {
                id: r.productId,
                name: r.productName,
                imageUrl: r.productImageUrl,
            },
            ingredients: r.ingredients,
        }));

        if (serializedItems.length === 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'Cart has no items' });
        }

        // Calculate total amount including VAT and delivery
        const orderItemsTotal = cart.totalAmount;
        const orderVatAmount = Math.round((orderItemsTotal * VAT_RATE) / 100);
        const totalAmountWithVATAndDelivery = orderItemsTotal + orderVatAmount + DELIVERY_PRICE;

        const fullName = `${firstName} ${lastName}`.trim();
        const orderResult = await client.query(
            `
                INSERT INTO "Order"
                (token, "userId", "totalAmount", status, items, "fullName", email, phone, address, comment)
                VALUES
                    ($1, $2, $3, $4, $5::jsonb, $6, $7, $8, $9, $10)
                RETURNING *
            `,
            [
                cart.token,
                cart.userId || null,
                totalAmountWithVATAndDelivery,
                'PENDING',
                JSON.stringify(serializedItems),
                fullName,
                email,
                phone,
                address,
                comment || null,
            ],
        );

        const order = orderResult.rows[0];

        // Clear cart
        await client.query(`DELETE FROM "CartItem" WHERE "cartId" = $1`, [cart.id]);
        await client.query(
            `UPDATE "Cart" SET "totalAmount" = 0, "updatedAt" = NOW() WHERE id = $1`,
            [cart.id],
        );

        // Stripe Checkout Session
        const itemsTotal = serializedItems.reduce((sum, item) => sum + (Number(item.basePrice) * item.quantity), 0);
        const vatAmount = Math.round((itemsTotal * VAT_RATE) / 100);

        const lineItems = [
            // Add all products
            ...serializedItems.map((item) => ({
                quantity: item.quantity,
                price_data: {
                    currency: 'czk',
                    product_data: {
                        name: item.product.name,
                        images: item.product.imageUrl ? [item.product.imageUrl] : [],
                    },
                    unit_amount: Math.round(Number(item.basePrice) * 100),
                },
            })),
            // Add VAT as separate line item
            {
                quantity: 1,
                price_data: {
                    currency: 'czk',
                    product_data: {
                        name: `VAT (${VAT_RATE}%)`,
                        description: 'Value Added Tax',
                    },
                    unit_amount: vatAmount * 100,
                },
            },
           
            {
                quantity: 1,
                price_data: {
                    currency: 'czk',
                    product_data: {
                        name: 'Delivery',
                        description: 'Delivery service',
                    },
                    unit_amount: DELIVERY_PRICE * 100,
                },
            },
        ];

        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            payment_method_types: ['card'],
            line_items: lineItems,
            success_url: `http://localhost:5173/success?orderId=${order.id}`,
            cancel_url: `http://localhost:5173/cancel?orderId=${order.id}`,
            metadata: { orderId: order.id.toString() },
        });

        // Clear cart again to be safe
        await client.query(`DELETE FROM "CartItem" WHERE "cartId" = $1`, [cart.id]);
        await client.query(
            `UPDATE "Cart" SET "totalAmount" = 0, "updatedAt" = NOW() WHERE id = $1`,
            [cart.id],
        );

        // Send email
        try {
            await SendEmail(
                email,
                `Ye-pizza / Pay for your order #${order.id}`,
                {
                    orderId: order.id,
                    totalAmount: Number(order.totalAmount),
                    paymentUrl: session.url || `http://localhost:5173/checkout`,
                }
            );
            console.log(`Email sent successfully to ${email} for order #${order.id}`);
        } catch (emailError) {
            console.error('Failed to send email:', emailError);
        }

        await client.query('COMMIT');

        return res.status(201).json({
            order: {
                ...order,
            },
            checkoutUrl: session.url,
        });
    } catch (e) {
        await client.query('ROLLBACK');
        console.error('Create order error:', e);
        return res.status(500).json({ message: 'Failed to create order' });
    } finally {
        client.release();
    }
});

export default router;