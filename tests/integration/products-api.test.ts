import request from 'supertest';
import express from 'express';
import productsRouter from '../../back-end/routes/products';
import pool from '../../back-end/database/db';

jest.mock('../../back-end/database/db', () => ({
    __esModule: true,
    default: {
        connect: jest.fn(),
    },
}));

const app = express();
app.use('/api', productsRouter);

describe('Products API', () => {
    test('GET /api/products should return products list', async () => {
        const mockClient = {
            query: jest.fn().mockResolvedValue({
                rows: [
                    {
                        id: 1,
                        name: 'Маргарита',
                        imageUrl: '/images/pizza-1.png',
                        categoryId: 1,
                        ingredients: [],
                        items: [],
                    },
                ],
            }),
            release: jest.fn(),
        };

        const connectMock = pool.connect as unknown as jest.Mock;
        connectMock.mockResolvedValue(mockClient);

        const response = await request(app).get('/api/products').expect(200);

        expect(response.body).toHaveLength(1);
        expect(response.body[0].name).toBe('Маргарита');
        expect(mockClient.query).toHaveBeenCalled();
        expect(mockClient.release).toHaveBeenCalled();
    });

    test('GET /api/products should handle database errors', async () => {
        const connectMock = pool.connect as unknown as jest.Mock;
        connectMock.mockRejectedValue(new Error('Database connection failed'));

        const response = await request(app).get('/api/products').expect(500);

        expect(response.body.error).toBe('Failed to fetch products');
    });
});
