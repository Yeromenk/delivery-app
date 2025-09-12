import { Router, Request, Response } from 'express';
import pool from '../database/db';
import { stripe } from '../lib/stripe';
import { SendPaymentSuccessEmail, SendPaymentFailedEmail } from '../lib/send-email';
import type Stripe from 'stripe';

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
    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error('Webhook signature verification failed:', errorMessage);
        return res.status(400).json({ error: 'Webhook signature verification failed' });
    }

    const client = await pool.connect();

    try {
        switch (event.type) {
            case 'checkout.session.completed':
                await handlePaymentSuccess(event.data.object as Stripe.Checkout.Session, client);
                break;
            case 'checkout.session.expired':
                await handlePaymentFailure(event.data.object as Stripe.Checkout.Session, client);
                break;
            case 'payment_intent.payment_failed':
                console.log('Payment intent failed:', event.data.object.id);
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

const handlePaymentSuccess = async (
    session: Stripe.Checkout.Session,
    client: { query: (text: string, params?: unknown[]) => Promise<{ rows: unknown[] }> }
) => {
    const orderId = session.metadata?.orderId;

    if (!orderId) {
        console.error('Order ID not found in session metadata');
        return;
    }

    try {
        // Update order status to pay
        const updateResult = await client.query(
            `UPDATE "Order" SET status = 'SUCCEEDED', "updatedAt" = NOW() WHERE id = $1 RETURNING *`,
            [orderId]
        );

        if (updateResult.rows.length === 0) {
            console.error(`Order ${orderId} not found`);
            return;
        }

        const order = updateResult.rows[0] as {
            id: number;
            email: string;
            totalAmount: string;
            status: string
        };

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

const handlePaymentFailure = async (
    session: Stripe.Checkout.Session,
    client: { query: (text: string, params?: unknown[]) => Promise<{ rows: unknown[] }> }
) => {
    const orderId = session.metadata?.orderId;

    if (!orderId) {
        console.error('Order ID not found in session metadata');
        return;
    }

    try {
        // Update order status to fail
        const updateResult = await client.query(
            `UPDATE "Order" SET status = 'CANCELLED', "updatedAt" = NOW() WHERE id = $1 RETURNING *`,
            [orderId]
        );

        if (updateResult.rows.length === 0) {
            console.error(`Order ${orderId} not found`);
            return;
        }

        const order = updateResult.rows[0] as {
            id: number;
            email: string;
            totalAmount: string;
            status: string
        };

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
