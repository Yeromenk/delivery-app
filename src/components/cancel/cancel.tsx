import {XCircle} from "lucide-react";

const Cancel = () => {
    setTimeout(() => {
        window.location.href = '/';
    }, 5000);

    return (
        <div className="page-wrapper">
            <div className="status-card cancel-card">
                <XCircle className="status-icon" />
                <h1>Payment Cancelled</h1>
                <p>Your payment was not completed. You can try again or continue shopping.</p>
                <p>You will be redirected to the main page shortly.</p>
            </div>
        </div>
    );
};

export default Cancel;
