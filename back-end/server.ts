import express from 'express';
import cors from 'cors';
import pool from './database/db';
import ingredientsRoutes from './routes/ingredients';
import productsRoutes from './routes/products';
import cartRoutes from './routes/cart';


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());

async function checkDatabaseConnection() {
    try {
        const client = await pool.connect();
        console.log('Successfully connected to PostgreSQL database');
        client.release();
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
}

// routes
app.use('/api', ingredientsRoutes);
app.use('/api', productsRoutes);
app.use('/api', cartRoutes);


async function startServer() {
    await checkDatabaseConnection();
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

startServer();