import React from "react";
import './cart-item-info.css';

interface Props {
    name: string;
    details: string;
}

const CartItemInfo: React.FC<Props> = ({ name, details }) => {
    return (
        <div className="cart-item-details-container">
            <div className="cart-item-header">
                <h2 className="cart-item-title">{name}</h2>
            </div>
            {details && <p className="cart-item-description">{details}</p>}
        </div>
    );
};

export default CartItemInfo;