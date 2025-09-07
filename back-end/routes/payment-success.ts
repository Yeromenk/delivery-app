import { Router, Request, Response } from 'express';
import pool from '../database/db';
import { SendPaymentSuccessEmail } from '../lib/send-email';

const router = Router();

router.post('/payment-success', async (req: Request, res: Response) => {
    const { orderId } = req.body;

    if (!orderId) {
        return res.status(400).json({ message: 'Order ID is required' });
    }

    const client = await pool.connect();

    try {
        // Get order details
        const orderResult = await client.query(
            `SELECT * FROM "Order" WHERE id = $1`,
            [orderId]
        );

        if (orderResult.rows.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const order = orderResult.rows[0];

        // Update order status to successful if not already
        if (order.status === 'PENDING') {
            await client.query(
                `UPDATE "Order" SET status = 'SUCCEEDED', "updatedAt" = NOW() WHERE id = $1`,
                [orderId]
            );
        }

        // Send success email
        try {
            await SendPaymentSuccessEmail(order.email, {
                orderId: parseInt(orderId),
                totalAmount: parseFloat(order.totalAmount),
                customerEmail: order.email
            });

            console.log(`Payment success email sent to ${order.email} for order #${orderId}`);

            return res.status(200).json({
                message: 'Payment confirmed and email sent',
                order: {
                    id: order.id,
                    status: 'SUCCEEDED',
                    totalAmount: order.totalAmount
                }
            });
        } catch (emailError) {
            console.error('Failed to send payment success email:', emailError);
            return res.status(200).json({
                message: 'Payment confirmed but email failed to send',
                order: {
                    id: order.id,
                    status: 'SUCCEEDED',
                    totalAmount: order.totalAmount
                }
            });
        }

    } catch (error) {
        console.error('Payment success confirmation error:', error);
        return res.status(500).json({ message: 'Failed to confirm payment' });
    } finally {
        client.release();
    }
});

export default router;
