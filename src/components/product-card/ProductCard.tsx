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
            <div className="productCard-container" data-testid="product-card">
                <div
                    className="productCard"
                    onClick={onClick}
                    style={{ cursor: 'pointer' }}
                >
                    <img className="product-img" src={imageUrl} alt={name} data-testid="product-image" />
                </div>

                <h2 className="productCard-h2" data-testid="product-name">{name}</h2>

                <p className="productCard-p" data-testid="product-ingredients">
                    {ingredients.length > 0
                        ? ingredients.map((ingredient) => ingredient.name).join(', ')
                        : ''}
                </p>

                <div className="product-footer">
                    <span className="product-price-text" data-testid="product-price">
                        from <b>{price} CZK</b>
                    </span>

                    <button
                        className="productCard-btn"
                        onClick={onClick}
                        data-testid="add-to-cart-button"
                    >
                        <Plus size={20} />
                        Add
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="productCard-container" data-testid="product-card">
            <Link
                to={`/products/${id}`}
                className="productCard"
                style={{ textDecoration: 'none', color: 'inherit' }}
            >
                <img className="product-img" src={imageUrl} alt={name} data-testid="product-image" />
            </Link>

            <h2 className="productCard-h2" data-testid="product-name">{name}</h2>

            <p className="productCard-p" data-testid="product-ingredients">
                {ingredients.length > 0
                    ? ingredients.map((ingredient) => ingredient.name).join(', ')
                    : ''}
            </p>

            <div className="product-footer">
                <span className="product-price-text" data-testid="product-price">
                    from <b>{price} CZK</b>
                </span>

                <Link
                    to={`/products/${id}`}
                    className="productCard-btn"
                    style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    data-testid="add-to-cart-button"
                >
                    <Plus size={20} />
                    Add
                </Link>
            </div>
        </div>
    );
};

export default ProductCard;