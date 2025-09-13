import React from 'react';
import { CountIconButton } from '../count-icon-button/count-icon-button';
import './count-button.css';

export interface CountButtonProps {
    value?: number;
    size?: 'sm' | 'lg';
    className?: string;
    onClick?: (type: 'plus' | 'minus') => void;
    loading?: boolean;
}

export const CountButton: React.FC<CountButtonProps> = ({
    className,
    onClick,
    value = 1,
    size = 'sm',
    loading,
}) => {
    const valueSizeClass = size === 'sm' ? 'count-value-sm' : 'count-value-lg';

    return (
        <div className={`count-button-container ${className || ''}`}>
            <CountIconButton
                onClick={() => onClick?.('minus')}
                disabled={value === 1 || loading}
                size={size}
                type="minus"
                data-testid="decrease-quantity"
            />

            <b className={valueSizeClass} data-testid="item-quantity">{value}</b>
            {loading && <span className="count-inline-spinner" aria-hidden="true" />}

            <CountIconButton
                onClick={() => onClick?.('plus')}
                size={size}
                type="plus"
                disabled={loading}
                data-testid="increase-quantity"
            />
        </div>
    );
};