import React from 'react';
import './Loading.css';

interface LoadingProps {
    size?: 'small' | 'medium' | 'large';
    text?: string;
    className?: string;
}

const Loading: React.FC<LoadingProps> = ({
    size = 'medium',
    text = 'Loading...',
    className = ''
}) => {
    return (
        <div className={`loading-container ${className}`}>
            <div className={`loading-spinner loading-spinner--${size}`}>
                <div className="spinner"></div>
            </div>
            {text && <span className="loading-text">{text}</span>}
        </div>
    );
};

export default Loading;
