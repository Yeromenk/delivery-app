import { Router, Request, Response } from 'express';
import pool from '../database/db';
import { stripe } from '../lib/stripe';
import { SendPaymentSuccessEmail, SendPaymentFailedEmail } from '../lib/send-email';

const router = Router();

// Webhook endpoint Stripe
router.post('/stripe-webhook', async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'] as string;
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!endpointSecret) {
        console.error('Stripe webhook secret not configured');
        return res.status(500).json({ error: 'Webhook secret not configured' });
    }

    let event;

    try {
        // Verify webhook signature
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err: any) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).json({ error: 'Webhook signature verification failed' });
    }

    const client = await pool.connect();

    try {
        switch (event.type) {
            case 'checkout.session.completed':
                await handlePaymentSuccess(event.data.object, client);
                break;
            case 'checkout.session.expired':
            case 'payment_intent.payment_failed':
                await handlePaymentFailure(event.data.object, client);
                break;
            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        res.status(200).json({ received: true });
    } catch (error) {
        console.error('Webhook processing error:', error);
        res.status(500).json({ error: 'Webhook processing failed' });
    } finally {
        client.release();
    }
});

const handlePaymentSuccess = async (session: any, client: any) => {
    const orderId = session.metadata?.orderId;

    if (!orderId) {
        console.error('Order ID not found in session metadata');
        return;
    }

    try {
        // Update order status to paid
        const updateResult = await client.query(
            `UPDATE "Order" SET status = 'SUCCEEDED', "updatedAt" = NOW() WHERE id = $1 RETURNING *`,
            [orderId]
        );

        if (updateResult.rows.length === 0) {
            console.error(`Order ${orderId} not found`);
            return;
        }

        const order = updateResult.rows[0];

        // Send success email
        await SendPaymentSuccessEmail(order.email, {
            orderId: parseInt(orderId),
            totalAmount: parseFloat(order.totalAmount),
            customerEmail: order.email
        });

        console.log(`Payment success processed for order ${orderId}`);
    } catch (error) {
        console.error(`Error processing payment success for order ${orderId}:`, error);
        throw error;
    }
};

const handlePaymentFailure = async (session: any, client: any) => {
    const orderId = session.metadata?.orderId;

    if (!orderId) {
        console.error('Order ID not found in session metadata');
        return;
    }

    try {
        // Update order status to failed
        const updateResult = await client.query(
            `UPDATE "Order" SET status = 'CANCELLED', "updatedAt" = NOW() WHERE id = $1 RETURNING *`,
            [orderId]
        );

        if (updateResult.rows.length === 0) {
            console.error(`Order ${orderId} not found`);
            return;
        }

        const order = updateResult.rows[0];

        // Send failure email
        await SendPaymentFailedEmail(order.email, {
            orderId: parseInt(orderId),
            totalAmount: parseFloat(order.totalAmount),
            customerEmail: order.email
        });

        console.log(`Payment failure processed for order ${orderId}`);
    } catch (error) {
        console.error(`Error processing payment failure for order ${orderId}:`, error);
        throw error;
    }
};

export default router;
