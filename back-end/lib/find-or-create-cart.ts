import pool from '../database/db';

export const findOrCreateCart = async (token: string) => {
    const client = await pool.connect();

    try {
        // Try to find existing cart
        const existingCart = await client.query(
            'SELECT id, token, "totalAmount" FROM "Cart" WHERE token = $1',
            [token]
        );

        if (existingCart.rows.length > 0) {
            return existingCart.rows[0];
        }

        // Create new cart if not found
        const newCart = await client.query(`
            INSERT INTO "Cart" (token, "totalAmount") 
            VALUES ($1, 0) 
            RETURNING id, token, "totalAmount"
        `, [token]);

        return newCart.rows[0];
    } finally {
        client.release();
    }
};