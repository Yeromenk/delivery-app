import './Skeleton.css';
import React from "react";

interface SkeletonProps {
    count?: number;
}

const Skeleton: React.FC<SkeletonProps> = ({count = 6}) => {
    return (
        <div className="ingredient-skeleton-container">
            {Array.from({length: count}).map((_, index) => (
                <div key={index} className="ingredient-skeleton-item">
                    <div className="ingredient-skeleton-checkbox"></div>
                    <div className="ingredient-skeleton-text"></div>
                </div>
            ))}
        </div>
    );
};

export default Skeleton;