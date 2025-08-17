import express from 'express';
import pool from '../database/db';

const router = express.Router();

router.get('/ingredients', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM "Ingredient"');
        client.release();

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching ingredients:', error);
        res.status(500).json({ error: 'Failed to fetch ingredients' });
    }
});

export default router;