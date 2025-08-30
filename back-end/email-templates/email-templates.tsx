interface EmailTemplateParams {
    orderId: number;
    totalAmount: number;
    paymentUrl: string;
}

export const EmailTemplates = ({ orderId, totalAmount, paymentUrl }: EmailTemplateParams): string => {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="utf-8">
            <title>Order Confirmation</title>
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
                h1 { color: #333; text-align: center; margin-bottom: 30px; }
                p { line-height: 1.6; color: #666; }
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
                .amount { 
                    font-size: 20px; 
                    font-weight: bold; 
                    color: #28a745; 
                    text-align: center;
                    margin: 20px 0;
                    padding: 15px;
                    background-color: #f8f9fa;
                    border-radius: 5px;
                }
                .footer { margin-top: 30px; font-size: 14px; color: #999; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Thank you for your order!</h1>
                <div class="amount">Total amount: ${totalAmount.toFixed(2)} CZK</div>
                <p>Please click the button below to complete your payment:</p>
                <div style="text-align: center;">
                    <a href="${paymentUrl}" class="button">Pay Now</a>
                </div>
                <p>If the button doesn't work, copy and paste this link into your browser:</p>
                <p style="word-break: break-all;"><a href="${paymentUrl}">${paymentUrl}</a></p>
                <div class="footer">
                    <p>Thank you for choosing App-pizza!</p>
                </div>
            </div>
        </body>
        </html>
    `;
};