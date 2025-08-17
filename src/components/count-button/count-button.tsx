import React from 'react';
import { CountIconButton } from '../count-icon-button/count-icon-button';
import './count-button.css';

export interface CountButtonProps {
    value?: number;
    size?: 'sm' | 'lg';
    className?: string;
    onClick?: (type: 'plus' | 'minus') => void;
}

export const CountButton: React.FC<CountButtonProps> = ({
                                                            className,
                                                            onClick,
                                                            value = 1,
                                                            size = 'sm',
                                                        }) => {
    const valueSizeClass = size === 'sm' ? 'count-value-sm' : 'count-value-lg';

    return (
        <div className={`count-button-container ${className || ''}`}>
            <CountIconButton
                onClick={() => onClick?.('minus')}
                disabled={value === 1}
                size={size}
                type="minus"
            />

            <b className={valueSizeClass}>{value}</b>

            <CountIconButton onClick={() => onClick?.('plus')} size={size} type="plus" />
        </div>
    );
};