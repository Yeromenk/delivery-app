import './ProductCard.css'
import React from "react";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

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
    id,
    name,
    price,
    imageUrl,
    onClick,
    ingredients = [],
}) => {
    if (onClick) {
        return (
            <div className="productCard-container">
                <div
                    className="productCard"
                    onClick={onClick}
                    style={{ cursor: 'pointer' }}
                >
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

                    <button
                        className="productCard-btn"
                        onClick={onClick}
                    >
                        <Plus size={20} />
                        Add
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="productCard-container">
            <Link
                to={`/products/${id}`}
                className="productCard"
                style={{ textDecoration: 'none', color: 'inherit' }}
            >
                <img className="product-img" src={imageUrl} alt={name} />
            </Link>

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

                <Link
                    to={`/products/${id}`}
                    className="productCard-btn"
                    style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    <Plus size={20} />
                    Add
                </Link>
            </div>
        </div>
    );
};

export default ProductCard;