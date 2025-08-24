import './ProductCard.css'
import React from "react";
import {Plus} from "lucide-react";

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
        <div>
            <div className="productCard" onClick={onClick}>
                <img className="product-img" src={imageUrl} alt="Pizza"/>
            </div>

            <h2 className="productCard-h2">{name}</h2>

            <p className="productCard-p">
                {ingredients.length > 0
                    ? ingredients.map((ingredient) => ingredient.name).join(', ')
                    : ''
                }
            </p>

            <div className="product-price">
                <span>from {price} CZK</span>
            </div>

            <button className="productCard-btn">
                <Plus size={20}/>
                Add
            </button>
        </div>
    );
};

export default ProductCard;