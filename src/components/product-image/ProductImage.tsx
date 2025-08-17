import React from 'react';
import './ProductImage.css';

interface ProductImageProps {
    imageUrl: string;
    size: number;
}

const ProductImage: React.FC<ProductImageProps> = ({imageUrl, size}) => {
    return (
        <div className="product-image-container">
            <img
                alt={"logo"}
                src={imageUrl}
                className={`product-image ${size === 20 ? 'size-20' : ''} ${size === 30 ? 'size-30' : ''} ${size === 40 ? 'size-40' : ''}`}
            />

            <div className="product-image-line"/>
            <div className="product-image-line-2"/>
        </div>
    );
};

export default ProductImage;