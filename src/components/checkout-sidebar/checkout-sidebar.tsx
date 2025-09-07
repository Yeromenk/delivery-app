import React from 'react';
import CheckoutItemsDetails from "../checkout-items-details/checkout-items-details.tsx";
import { ArrowRight, Package, Percent, Truck } from "lucide-react";
import { Skeleton } from 'primereact/skeleton';
import {  DELIVERY_PRICE, calculateVAT } from '../../constants/pricing';

interface Props {
    totalAmount: number;
    loading?: boolean;
}

const CheckoutSidebar: React.FC<Props> = ({ totalAmount, loading }) => {
    const vatPrice = calculateVAT(totalAmount);
    const totalPrice = totalAmount + vatPrice + DELIVERY_PRICE;

    return (
        <div className="checkout-right">
            <div className="white-block">
                <h1>4. Payment</h1>

                <div className="payment-summary">
                    <h3>Overall:</h3>
                    {loading ? (
                        <Skeleton width="120px" height="2rem" />
                    ) : (
                        <span className="total-price">{totalPrice} CZK</span>
                    )}
                </div>

                <div className="payment-details">
                    <CheckoutItemsDetails title={
                        <div className="checkout-items-title">
                            <Package className='icon-price' />
                            Price
                        </div>
                    } value={loading ? <Skeleton width="80px" height="1.25rem" /> : `${totalAmount} CZK`} />

                    <CheckoutItemsDetails title={
                        <div className="checkout-items-title">
                            <Percent className='icon-price' />
                            Taxes
                        </div>
                    } value={loading ? <Skeleton width="80px" height="1.25rem" /> : `${vatPrice} CZK`} />

                    <CheckoutItemsDetails title={
                        <div className="checkout-items-title">
                            <Truck className='icon-price' />
                            Delivery
                        </div>
                    } value={loading ? <Skeleton width="80px" height="1.25rem" /> : `${DELIVERY_PRICE} CZK`} />

                    <button className="checkout-button" type="submit" disabled={loading} aria-busy={loading}>
                        <span>Go to payment</span>
                        {loading ? (
                            <span className="checkout-spinner" aria-hidden="true" />
                        ) : (
                            <ArrowRight className="w-5 ml-2" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CheckoutSidebar;