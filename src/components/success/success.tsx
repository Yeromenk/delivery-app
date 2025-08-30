import './success.css'
import {CheckCircle} from "lucide-react";

const Success = () => {
    setTimeout(() => {
        window.location.href = '/';
    }, 5000);

    return (
        <div className="page-wrapper">
            <div className="status-card success-card">
                <CheckCircle className="status-icon" />
                <h1>Payment Successful!</h1>
                <p>Thank you for your order. Your payment has been processed successfully.</p>
                <p>You will be redirected to the main page shortly.</p>
            </div>
        </div>
    );
};

export default Success;
