import express from 'express';
import pool from '../database/db';

const router = express.Router();

interface Product {
    id: number;
    name: string;
    imageUrl: string;
    categoryId: number;
}

router.get('/categories', async (req, res) => {
    try {
        const {
            query,
            sizes,
            pizzasTypes,
            ingredients,
            priceFrom,
            priceTo,
            sortBy
        } = req.query;

        const sizesArray = sizes && typeof sizes === 'string' ? sizes.split(',').map(Number) : null;
        const pizzaTypesArray = pizzasTypes && typeof pizzasTypes === 'string' ? pizzasTypes.split(',').map(Number) : null;
        const ingredientsArray = ingredients && typeof ingredients === 'string' ? ingredients.split(',').map(Number) : null;
        const minPrice = Number(priceFrom) || 0;
        const maxPrice = Number(priceTo) || 1000;

        const whereConditions: string[] = [];
        const params: (string | number | number[])[] = [];
        let paramCounter = 1;

        if (query && typeof query === 'string') {
            whereConditions.push(`p.name ILIKE $${paramCounter}`);
            params.push(`%${query}%`);
            paramCounter++;
        }

        if (sizesArray || pizzaTypesArray) {
            const itemConditions: string[] = [];

            if (sizesArray) {
                itemConditions.push(`pi.size = ANY($${paramCounter})`);
                params.push(sizesArray);
                paramCounter++;
            }

            if (pizzaTypesArray) {
                itemConditions.push(`pi."pizzaType" = ANY($${paramCounter})`);
                params.push(pizzaTypesArray);
                paramCounter++;
            }

            whereConditions.push(`EXISTS (
                SELECT 1 FROM "ProductItem" pi 
                WHERE pi."productId" = p.id 
                AND (${itemConditions.join(' OR ')})
                AND pi.price BETWEEN $${paramCounter} AND $${paramCounter + 1}
            )`);
            params.push(minPrice, maxPrice);
            paramCounter += 2;
        } else {
            whereConditions.push(`EXISTS (
                SELECT 1 FROM "ProductItem" pi 
                WHERE pi."productId" = p.id 
                AND pi.price BETWEEN $${paramCounter} AND $${paramCounter + 1}
            )`);
            params.push(minPrice, maxPrice);
            paramCounter += 2;
        }

        if (ingredientsArray) {
            whereConditions.push(`EXISTS (
                SELECT 1 FROM "_IngredientToProduct" itp 
                WHERE itp."B" = p.id 
                AND itp."A" = ANY($${paramCounter})
            )`);
            params.push(ingredientsArray);
            paramCounter++;
        }

        const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
        const queryText = `
            WITH filtered_products AS (
                SELECT DISTINCT
                    p.id,
                    p.name,
                    p."imageUrl",
                    p."categoryId",
                    MIN(pi.price) as min_price
                FROM "Product" p
                         JOIN "ProductItem" pi ON p.id = pi."productId"
                         JOIN "Category" c ON p."categoryId" = c.id
                    ${whereClause}
                GROUP BY p.id, p.name, p."imageUrl", p."categoryId"
            )
            SELECT
                c.id as category_id,
                c.name as category_name,
                json_agg(
                        json_build_object(
                            'id', fp.id,
                        'name', fp.name,
                        'imageUrl', fp."imageUrl",
                        'categoryId', fp."categoryId"
                    ) ${sortBy === 'price' ? 'ORDER BY fp.min_price ASC' : 'ORDER BY fp.id DESC'}
                ) as products
            FROM "Category" c
                     LEFT JOIN filtered_products fp ON c.id = fp."categoryId"
            WHERE fp.id IS NOT NULL
            GROUP BY c.id, c.name
            ORDER BY c.id
        `;

        const result = await pool.query(queryText, params);

        const categoriesWithDetails = await Promise.all(
            result.rows.map(async (category: {
                category_id: number;
                category_name: string;
                products: Product[]
            }) => {
                const categoryProducts = await Promise.all(
                    category.products.map(async (product: Product) => {
                        const itemsQuery = `
                            SELECT id, price, size, "pizzaType"
                            FROM "ProductItem"
                            WHERE "productId" = $1
                              AND price BETWEEN $2 AND $3
                            ORDER BY price
                        `;
                        const itemsResult = await pool.query(itemsQuery, [product.id, minPrice, maxPrice]);

                        const ingredientsQuery = `
                            SELECT i.id, i.name, i.price, i."imageUrl"
                            FROM "Ingredient" i
                                     JOIN "_IngredientToProduct" itp ON i.id = itp."A"
                            WHERE itp."B" = $1
                        `;
                        const ingredientsResult = await pool.query(ingredientsQuery, [product.id]);

                        return {
                            ...product,
                            items: itemsResult.rows,
                            ingredients: ingredientsResult.rows
                        };
                    })
                );

                return {
                    id: category.category_id,
                    name: category.category_name,
                    products: categoryProducts
                };
            })
        );

        res.json(categoriesWithDetails);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;