import React from 'react';
import './checkout-items-details.css'

interface Props {
    title?: React.ReactNode;
    value?: React.ReactNode;
}

const CheckoutItemsDetails: React.FC<Props> = ({title, value}) => {
    return (
        <div className="checkout-items-content">
           <span>
               {title}
               <div className="checkout-items-dots"/>
           </span>
            <span>{value}</span>
        </div>
    );
};

export default CheckoutItemsDetails;