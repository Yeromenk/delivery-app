// Setup file for integration tests
process.env.NODE_ENV = 'test';
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '5432';
process.env.DB_NAME = 'ye-pizza-test';
process.env.DB_USER = 'postgres';
process.env.DB_PASSWORD = 'postgres';

// Global timeout for tests
jest.setTimeout(30000);

// Mock environment variables for Stripe
process.env.STRIPE_SECRET_KEY = 'sk_test_mock_key';
process.env.FRONTEND_URL = 'http://localhost:3000';
process.env.STRIPE_SUCCESS_URL = 'http://localhost:3000/success';
process.env.STRIPE_CANCEL_URL = 'http://localhost:3000/cancel';
