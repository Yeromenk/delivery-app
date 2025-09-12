import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import './success.css'
import { CheckCircle } from "lucide-react";
import { API_ENDPOINTS } from '../../lib/api-config';

const Success = () => {
    const [searchParams] = useSearchParams();
    const [emailSent, setEmailSent] = useState(false);
    const orderId = searchParams.get('orderId');

    useEffect(() => {
        // Confirm payment and send success email
        const confirmPayment = async () => {
            if (orderId && !emailSent) {
                try {
                    await axios.post(API_ENDPOINTS.paymentSuccess, {
                        orderId: parseInt(orderId)
                    });
                    setEmailSent(true);
                    console.log('Payment confirmed and email sent');
                } catch (error) {
                    console.error('Failed to confirm payment:', error);
                }
            }
        };

        confirmPayment();
    }, [orderId, emailSent]);

    setTimeout(() => {
        window.location.href = '/';
    }, 5000);

    return (
        <div className="page-wrapper">
            <div className="status-card success-card">
                <CheckCircle className="status-icon" />
                <h1>Payment Successful!</h1>
                <p>Thank you for your order. Your payment has been processed successfully.</p>
                {orderId && <p><strong>Order ID:</strong> #{orderId}</p>}
                <p>A confirmation email has been sent to your email address.</p>
                <p>You will be redirected to the main page shortly.</p>
            </div>
        </div>
    );
};

export default Success;
