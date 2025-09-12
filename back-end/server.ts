import express from 'express';
import cors from 'cors';
import pool from './database/db';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth';
import ingredientsRoutes from './routes/ingredients';
import productsRoutes from './routes/products';
import cartRoutes from './routes/cart';
import searchRoutes from './routes/search';
import createOrderRoutes from './routes/create-order';
import storiesRoutes from './routes/stories';
import stripeWebhookRoutes from './routes/stripe-webhook';
import paymentSuccessRoutes from './routes/payment-success';
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
    'http://localhost:5173',  
    'http://localhost',      
    'http://localhost:80',    
    process.env.FRONTEND_URL  
].filter((origin): origin is string => typeof origin === 'string');

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));
app.use(cookieParser());
app.use('/api/webhooks', express.raw({ type: 'application/json' }), stripeWebhookRoutes);
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
app.use('/api/search', searchRoutes);
app.use('/api', createOrderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/stories', storiesRoutes);
app.use('/api', paymentSuccessRoutes);

async function startServer() {
    await checkDatabaseConnection();
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

startServer();