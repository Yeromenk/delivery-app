interface EmailTemplateParams {
    orderId: number;
    totalAmount: number;
    paymentUrl: string;
}

interface PaymentStatusEmailParams {
    orderId: number;
    totalAmount: number;
    customerEmail: string;
}

export const EmailTemplates = ({ orderId, totalAmount, paymentUrl }: EmailTemplateParams): string => {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="utf-8">
            <title>Order Confirmation - Ye Pizza</title>
            <style>
                body { 
                    font-family: system-ui, Avenir, Helvetica, Arial, sans-serif; 
                    margin: 0; 
                    padding: 20px; 
                    background-color: #F4F1EE;
                    line-height: 1.5;
                }
                .container { 
                    max-width: 600px; 
                    margin: 0 auto; 
                    background-color: white; 
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                }
                .header {
                    background: linear-gradient(135deg, #ff5a1f 0%, #ff7043 100%);
                    padding: 30px;
                    text-align: center;
                    color: white;
                }
                .header h1 { 
                    margin: 0;
                    font-size: 28px;
                    font-weight: 700;
                }
                .logo {
                    font-size: 24px;
                    font-weight: bold;
                    margin-bottom: 10px;
                }
                .content {
                    padding: 30px;
                }
                p { 
                    line-height: 1.6; 
                    color: #444; 
                    margin-bottom: 16px;
                }
                .button {
                    display: inline-block;
                    padding: 16px 32px;
                    background: linear-gradient(135deg, #ff5a1f 0%, #ff7043 100%);
                    color: white !important;
                    text-decoration: none; 
                    border-radius: 8px;
                    margin: 20px 0;
                    font-weight: 600;
                    text-align: center;
                    font-size: 16px;
                    transition: transform 0.2s ease;
                }
                .button:hover { 
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(255, 90, 31, 0.4);
                }
                .amount { 
                    font-size: 24px; 
                    font-weight: bold; 
                    color: #ff5a1f; 
                    text-align: center;
                    margin: 25px 0;
                    padding: 20px;
                    background: linear-gradient(135deg, #fff5f2 0%, #ffe8e0 100%);
                    border-radius: 8px;
                    border: 2px solid #ffebe5;
                }
                .order-details {
                    background-color: #F4F1EE;
                    padding: 20px;
                    border-radius: 8px;
                    margin: 20px 0;
                }
                .order-details h3 {
                    color: #ff5a1f;
                    margin-bottom: 10px;
                }
                .footer { 
                    background-color: #F4F1EE;
                    padding: 25px 30px;
                    text-align: center;
                    font-size: 14px; 
                    color: #666;
                    border-top: 1px solid #e0dcd7;
                }
                .footer .logo-footer {
                    color: #ff5a1f;
                    font-weight: bold;
                    font-size: 18px;
                    margin-bottom: 8px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">🍕 Ye Pizza</div>
                    <h1>Order Confirmation</h1>
                </div>
                <div class="content">
                    <p>Thank you for your order! We're excited to prepare your delicious pizza.</p>
                    
                    <div class="order-details">
                        <h3>Order Details</h3>
                        <p><strong>Order ID:</strong> #${orderId}</p>
                        <p><strong>Status:</strong> Waiting for payment</p>
                    </div>
                    
                    <div class="amount">Total: ${totalAmount.toFixed(2)} CZK</div>
                    
                    <p>Please click the button below to complete your payment and confirm your order:</p>
                    <div style="text-align: center;">
                        <a href="${paymentUrl}" class="button">Complete Payment 🍕</a>
                    </div>
                    
                    <p><small>If the button doesn't work, copy and paste this link into your browser:</small></p>
                    <p style="word-break: break-all; font-size: 12px; color: #666;"><a href="${paymentUrl}" style="color: #ff5a1f;">${paymentUrl}</a></p>
                </div>
                <div class="footer">
                    <div class="logo-footer">Ye Pizza</div>
                    <p>Thank you for choosing us for your pizza cravings!</p>
                </div>
            </div>
        </body>
        </html>
    `;
};

export const PaymentSuccessEmailTemplate = ({ orderId, totalAmount, customerEmail }: PaymentStatusEmailParams): string => {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="utf-8">
            <title>Payment Successful</title>
            <style>
                body { 
                    font-family: system-ui, Avenir, Helvetica, Arial, sans-serif; 
                    margin: 0; 
                    padding: 20px; 
                    background-color: #F4F1EE;
                    line-height: 1.5;
                }
                .container { 
                    max-width: 600px; 
                    margin: 0 auto; 
                    background-color: white; 
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                }
                .header {
                    background: linear-gradient(135deg, #28a745 0%, #34ce57 100%);
                    padding: 30px;
                    text-align: center;
                    color: white;
                }
                .header h1 { 
                    margin: 0;
                    font-size: 28px;
                    font-weight: 700;
                }
                .logo {
                    font-size: 24px;
                    font-weight: bold;
                    margin-bottom: 10px;
                }
                .content {
                    padding: 30px;
                }
                .success-icon { 
                    text-align: center; 
                    font-size: 64px; 
                    margin: 20px 0;
                }
                p { 
                    line-height: 1.6; 
                    color: #444; 
                    margin-bottom: 16px;
                }
                .amount { 
                    font-size: 24px; 
                    font-weight: bold; 
                    color: #28a745; 
                    text-align: center;
                    margin: 25px 0;
                    padding: 20px;
                    background: linear-gradient(135deg, #f8fff9 0%, #e8f7ea 100%);
                    border-radius: 8px;
                    border: 2px solid #d4edda;
                }
                .order-info {
                    background: linear-gradient(135deg, #F4F1EE 0%, #e8e5e2 100%);
                    padding: 20px;
                    border-radius: 8px;
                    margin: 20px 0;
                    border-left: 4px solid #ff5a1f;
                }
                .order-info h3 {
                    color: #ff5a1f;
                    margin-bottom: 15px;
                    font-size: 18px;
                }
                .status-badge {
                    display: inline-block;
                    background: #28a745;
                    color: white;
                    padding: 6px 12px;
                    border-radius: 20px;
                    font-size: 14px;
                    font-weight: 600;
                }
                .next-steps {
                    background: linear-gradient(135deg, #fff5f2 0%, #ffe8e0 100%);
                    padding: 20px;
                    border-radius: 8px;
                    margin: 20px 0;
                    border-left: 4px solid #ff5a1f;
                }
                .next-steps h3 {
                    color: #ff5a1f;
                    margin-bottom: 10px;
                }
                .footer { 
                    background-color: #F4F1EE;
                    padding: 25px 30px;
                    text-align: center;
                    font-size: 14px; 
                    color: #666;
                    border-top: 1px solid #e0dcd7;
                }
                .footer .logo-footer {
                    color: #ff5a1f;
                    font-weight: bold;
                    font-size: 18px;
                    margin-bottom: 8px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">🍕 Ye Pizza</div>
                    <h1>Payment Successful!</h1>
                </div>
                <div class="content">
                    <div class="success-icon">✅</div>
                    
                    <p style="text-align: center; font-size: 18px; color: #28a745; font-weight: 600;">
                        Your payment has been processed successfully!
                    </p>
                    
                    <div class="amount">Paid: ${totalAmount.toFixed(2)} CZK</div>
                    
                    <div class="order-info">
                        <h3>📋 Order Details</h3>
                        <p><strong>Order ID:</strong> #${orderId}</p>
                        <p><strong>Customer:</strong> ${customerEmail}</p>
                        <p><strong>Status:</strong> <span class="status-badge">✅ Paid</span></p>
                        <p><strong>Payment Date:</strong> ${new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })}</p>
                    </div>
                    
                    <div class="next-steps">
                        <h3>🚀 What's Next?</h3>
                        <p>• Our kitchen team will start preparing your order immediately</p>
                        <p>• You'll receive a notification when your order is ready for delivery</p>
                        <p>• Estimated delivery time: 30-45 minutes</p>
                        <p>• Track your order status in your account</p>
                    </div>
                    
                    <p style="text-align: center; font-style: italic; color: #666;">
                        Thank you for choosing Ye Pizza! We hope you enjoy your delicious meal! 🍕❤️
                    </p>
                </div>
                <div class="footer">
                    <div class="logo-footer">Ye Pizza</div>
                    <p>Your satisfaction is our priority!</p>
                </div>
            </div>
        </body>
        </html>
    `;
};

export const PaymentFailedEmailTemplate = ({ orderId, totalAmount }: PaymentStatusEmailParams): string => {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="utf-8">
            <title>Payment Failed</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4; }
                .container { 
                    max-width: 600px; 
                    margin: 0 auto; 
                    background-color: white; 
                    padding: 30px; 
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                h1 { color: #dc3545; text-align: center; margin-bottom: 30px; }
                p { line-height: 1.6; color: #666; }
                .error-icon { 
                    text-align: center; 
                    font-size: 48px; 
                    color: #dc3545; 
                    margin-bottom: 20px; 
                }
                .amount { 
                    font-size: 20px; 
                    font-weight: bold; 
                    color: #dc3545; 
                    text-align: center;
                    margin: 20px 0;
                    padding: 15px;
                    background-color: #f8d7da;
                    border-radius: 5px;
                    border: 1px solid #f5c6cb;
                }
                .button {
                    display: inline-block;
                    padding: 15px 30px;
                    background-color: #007bff;
                    color: white !important;
                    text-decoration: none; 
                    border-radius: 5px;
                    margin: 20px 0;
                    font-weight: bold;
                    text-align: center;
                }
                .button:hover { background-color: #0056b3; }
                .footer { margin-top: 30px; font-size: 14px; color: #999; }
                .order-info {
                    background-color: #f8f9fa;
                    padding: 20px;
                    border-radius: 5px;
                    margin: 20px 0;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="error-icon">❌</div>
                <h1>Payment Failed</h1>
                <p>Dear Customer,</p>
                <p>We regret to inform you that your payment could not be processed.</p>
                
                <div class="order-info">
                    <h3>Order Details:</h3>
                    <p><strong>Order ID:</strong> #${orderId}</p>
                    <p><strong>Total Amount:</strong> ${totalAmount.toFixed(2)} CZK</p>
                    <p><strong>Payment Status:</strong> <span style="color: #dc3545;">Failed</span></p>
                </div>
                
                <p>This could be due to insufficient funds, an expired card, or a technical issue. Please check your payment method and try again.</p>
                
                <div style="text-align: center;">
                    <a href="http://localhost:5173/checkout" class="button">Try Again</a>
                </div>
                
                <p>If you continue to experience issues, please contact your bank or try a different payment method.</p>
                
                <div class="footer">
                    <p>If you need assistance, please contact our support team.</p>
                    <p>Ye-pizza Team</p>
                </div>
            </div>
        </body>
        </html>
    `;
};