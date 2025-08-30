import './ProductCard.css'
import React from "react";
import { Plus } from "lucide-react";

interface Ingredient {
    id: number;
    name: string;
    imageUrl: string;
    price: number;
}

interface IProductCardProps {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    onClick?: () => void;
    ingredients?: Ingredient[];
    loading?: boolean;
}

const ProductCard: React.FC<IProductCardProps> = ({
    name,
    price,
    imageUrl,
    onClick,
    ingredients = [],
}) => {
    return (
        <div className="productCard-container">
            <div className="productCard" onClick={onClick}>
                <img className="product-img" src={imageUrl} alt={name} />
            </div>

            <h2 className="productCard-h2">{name}</h2>

            <p className="productCard-p">
                {ingredients.length > 0
                    ? ingredients.map((ingredient) => ingredient.name).join(', ')
                    : ''}
            </p>

            <div className="product-footer">
                <span className="product-price-text">
                    from <b>{price} CZK</b>
                </span>

                <button className="productCard-btn">
                    <Plus size={20} />
                    Add
                </button>
            </div>
        </div>
    );
};

export default ProductCard;