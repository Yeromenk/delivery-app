import React from "react";

interface ItemPrice {
    value: number;
    loading?: boolean;
}

export const CartItemDetailsPrice: React.FC<ItemPrice> = ({ value, loading }) => {
    if (loading) {
        return (
            <span
                style={{
                    display: 'inline-block',
                    width: '64px',
                    height: '16px',
                    borderRadius: '4px',
                    background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                    backgroundSize: '200% 100%',
                    animation: 'skeleton-loading 1.2s infinite',
                }}
            />
        );
    }

    return (
        <h2 style={{ fontSize: '1rem', fontWeight: 'bold', lineHeight: 1, margin: 0, whiteSpace: 'nowrap', minWidth: '64px' }}>
            {value} CZK
        </h2>
    );
};