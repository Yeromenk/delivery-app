import express from 'express';
import pool from '../database/db';

const router = express.Router();

// Get all products with ingredients and product items
router.get('/products', async (req, res) => {
    try {
        const client = await pool.connect();

        const result = await client.query(`
            SELECT 
                p.id,
                p.name,
                p."imageUrl",
                p."categoryId",
                COALESCE(
                    json_agg(
                        DISTINCT jsonb_build_object(
                            'id', i.id,
                            'name', i.name,
                            'price', i.price,
                            'imageUrl', i."imageUrl"
                        )
                    ) FILTER (WHERE i.id IS NOT NULL), 
                    '[]'
                ) as ingredients,
                COALESCE(
                    json_agg(
                        DISTINCT jsonb_build_object(
                            'id', pi.id,
                            'price', pi.price,
                            'size', pi.size,
                            'pizzaType', pi."pizzaType"
                        )
                    ) FILTER (WHERE pi.id IS NOT NULL),
                    '[]'
                ) as items
            FROM "Product" p
            LEFT JOIN "_IngredientToProduct" itp ON p.id = itp."B"
            LEFT JOIN "Ingredient" i ON itp."A" = i.id
            LEFT JOIN "ProductItem" pi ON p.id = pi."productId"
            GROUP BY p.id, p.name, p."imageUrl", p."categoryId"
            ORDER BY p.name
        `);

        client.release();
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// Search products by name
router.get('/products/search', async (req, res) => {
    try {
        const { query } = req.query;

        if (!query || typeof query !== 'string') {
            return res.status(400).json({ error: 'Search query is required' });
        }

        const client = await pool.connect();
        const result = await client.query(
            'SELECT * FROM "Product" WHERE LOWER(name) LIKE LOWER($1) ORDER BY name',
            [`%${query}%`]
        );
        client.release();

        res.json(result.rows);
    } catch (error) {
        console.error('Error searching products:', error);
        res.status(500).json({ error: 'Failed to search products' });
    }
});

// Get single product by ID
router.get('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const client = await pool.connect();

        const result = await client.query(`
            SELECT 
                p.id,
                p.name,
                p."imageUrl",
                p."categoryId",
                COALESCE(
                    json_agg(
                        DISTINCT jsonb_build_object(
                            'id', i.id,
                            'name', i.name,
                            'price', i.price,
                            'imageUrl', i."imageUrl"
                        )
                    ) FILTER (WHERE i.id IS NOT NULL), 
                    '[]'
                ) as ingredients,
                COALESCE(
                    json_agg(
                        DISTINCT jsonb_build_object(
                            'id', pi.id,
                            'price', pi.price,
                            'size', pi.size,
                            'pizzaType', pi."pizzaType"
                        )
                    ) FILTER (WHERE pi.id IS NOT NULL),
                    '[]'
                ) as items
            FROM "Product" p
            LEFT JOIN "_IngredientToProduct" itp ON p.id = itp."B"
            LEFT JOIN "Ingredient" i ON itp."A" = i.id
            LEFT JOIN "ProductItem" pi ON p.id = pi."productId"
            WHERE p.id = $1
            GROUP BY p.id, p.name, p."imageUrl", p."categoryId"
        `, [id]);

        client.release();

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});

// Get all categories with products, ingredients, and items
router.get('/categories', async (req, res) => {
    try {
        const client = await pool.connect();

        const result = await client.query(`
            SELECT 
                c.id,
                c.name,
                COALESCE(
                    json_agg(
                        json_build_object(
                            'id', p.id,
                            'name', p.name,
                            'imageUrl', p."imageUrl",
                            'categoryId', p."categoryId",
                            'ingredients', p_ingredients.ingredients,
                            'items', p_items.items
                        )
                    ) FILTER (WHERE p.id IS NOT NULL),
                    '[]'
                ) as products
            FROM "Category" c
            LEFT JOIN "Product" p ON c.id = p."categoryId"
            LEFT JOIN LATERAL (
                SELECT COALESCE(
                    json_agg(
                        json_build_object(
                            'id', i.id,
                            'name', i.name,
                            'price', i.price,
                            'imageUrl', i."imageUrl"
                        )
                    ) FILTER (WHERE i.id IS NOT NULL),
                    '[]'
                ) as ingredients
                FROM "_IngredientToProduct" itp
                LEFT JOIN "Ingredient" i ON itp."A" = i.id
                WHERE itp."B" = p.id
            ) p_ingredients ON true
            LEFT JOIN LATERAL (
                SELECT COALESCE(
                    json_agg(
                        json_build_object(
                            'id', pi.id,
                            'price', pi.price,
                            'size', pi.size,
                            'pizzaType', pi."pizzaType"
                        )
                    ) FILTER (WHERE pi.id IS NOT NULL),
                    '[]'
                ) as items
                FROM "ProductItem" pi
                WHERE pi."productId" = p.id
            ) p_items ON true
            GROUP BY c.id, c.name
            ORDER BY c.id
        `);

        client.release();
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});


export default router;