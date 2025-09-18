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

// Updated CORS configuration for Vercel
const allowedOrigins = [
    'http://localhost:5173',  
    'http://localhost',      
    'http://localhost:80',    
    process.env.FRONTEND_URL,
    // Add all possible Vercel domains
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
    'https://delivery-app-henna.vercel.app',
    'https://delivery-app-henna-*.vercel.app',
    // Allow all vercel app domains for development
    /^https:\/\/.*\.vercel\.app$/
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true);

        // Check against allowed origins
        const isAllowed = allowedOrigins.some(allowedOrigin => {
            if (typeof allowedOrigin === 'string') {
                return origin === allowedOrigin;
            }
            if (allowedOrigin instanceof RegExp) {
                return allowedOrigin.test(origin);
            }
            return false;
        });

        if (isAllowed) {
            callback(null, true);
        } else {
            console.log(`CORS blocked origin: ${origin}`);
            callback(null, true); // Allow all origins for now to debug
        }
    },
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
        return true;
    } catch (error) {
        console.error('Database connection failed:', error);
        // Don't exit process on Vercel, just return false
        if (process.env.NODE_ENV !== 'production') {
            process.exit(1);
        }
        return false;
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

// Health check endpoint for debugging
app.get('/api/health', async (req, res) => {
    const dbConnected = await checkDatabaseConnection();
    res.json({
        status: dbConnected ? 'ok' : 'error',
        database: dbConnected ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV,
        dbConfig: {
            host: process.env.DB_HOST || 'not set',
            user: process.env.DB_USER || 'not set',
            name: process.env.DB_NAME || 'not set',
            port: process.env.DB_PORT || 'not set'
        }
    });
});

// Debug endpoint to check environment variables
app.get('/api/debug', (req, res) => {
    res.json({
        nodeEnv: process.env.NODE_ENV,
        dbHost: process.env.DB_HOST ? 'set' : 'not set',
        dbUser: process.env.DB_USER ? 'set' : 'not set',
        dbName: process.env.DB_NAME ? 'set' : 'not set',
        dbPort: process.env.DB_PORT ? 'set' : 'not set',
        vercelUrl: process.env.VERCEL_URL || 'not set'
    });
});

// For local development
async function startServer() {
    if (process.env.NODE_ENV !== 'production') {
        await checkDatabaseConnection();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
}

// Export for Vercel
export default app;

// Start server only in development
if (process.env.NODE_ENV !== 'production') {
    startServer();
}
