import React from 'react';
import { Minus, Plus } from 'lucide-react';
import './count-icon-button.css';

interface Props {
    type: 'plus' | 'minus';
    size?: 'sm' | 'lg';
    disabled?: boolean;
    onClick?: () => void;
}

export const CountIconButton: React.FC<Props> = ({ type, size = 'sm', disabled, onClick }) => {
    const sizeClass = size === 'sm' ? 'icon-button-sm' : 'icon-button-lg';
    const iconSizeClass = size === 'sm' ? 'icon-sm' : 'icon-lg';

    return (
        <button
            className={`count-icon-button ${sizeClass}`}
            onClick={onClick}
            disabled={disabled}
        >
            {type === 'plus' ? (
                <Plus className={iconSizeClass} />
            ) : (
                <Minus className={iconSizeClass} />
            )}
        </button>
    );
};