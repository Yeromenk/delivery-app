import React from "react";

interface ItemPrice {
    value: number;
}

export const CartItemDetailsPrice: React.FC<ItemPrice> = ({ value }) => {
    return (
        <h2 style={{ fontSize: '1rem', fontWeight: 'bold', lineHeight: 1, margin: 0, whiteSpace: 'nowrap' }}>
            {value} CZK
        </h2>
    );
};