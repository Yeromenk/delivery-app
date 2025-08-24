import React from 'react';
import {CartItemDetailsImage} from "../cart-item-details/cart-item-details-image.tsx";
import CartItemInfo from "../cart-item-details/cart-item-info.tsx";
import {CartItemDetailsPrice} from "../cart-item-details/cart-item-details-price.tsx";
import {CartItemDetailsCountButton} from "../cart-item-details/cart-item-details-count-button.tsx";
import {X} from "lucide-react";
import type {CartItemProps} from "../cart-item-details/cart-item-details.types.ts";
import './cart-item.css';

interface Props extends CartItemProps {
    onClickRemove?: () => void;
    onClickCountButton?: (type: 'plus' | 'minus') => void;
    className?: string;
}

const CartItem: React.FC<Props> = ({ disabled, onClickRemove, onClickCountButton, name, imageUrl, details, quantity, price }) => {
    return (
        <div className={`cart-item ${disabled ? 'disabled' : ''}`}>
            <div className="cart-item-left">
                <CartItemDetailsImage src={imageUrl}/>
                <CartItemInfo name={name} details={details}/>
            </div>

            <CartItemDetailsPrice value={price}/>

            <div className="cart-item-actions">
                <CartItemDetailsCountButton onClick={onClickCountButton} value={quantity}/>
                <button className="cart-item-remove" onClick={onClickRemove}>
                    <X size={20}/>
                </button>
            </div>
        </div>
    );
};

export default CartItem;