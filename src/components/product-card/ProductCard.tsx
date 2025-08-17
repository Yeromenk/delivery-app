import './ProductCard.css'
import {Link} from "react-router-dom";
import React from "react";
import {Plus} from "lucide-react";

interface IProductCardProps {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    onClick?: () => void;
}

const ProductCard: React.FC<IProductCardProps> = ({
                                                      id,
                                                      name,
                                                      price,
                                                      imageUrl,
                                                      onClick,
                                                  }) => {
    return (
        <div>
            {/*<Link to={`/products/${id}`} >*/}
                <div className="productCard" onClick={onClick}>
                    <img className="product-img" src={imageUrl} alt="Pizza"/>
                </div>

                <h2 className="productCard-h2"> {name}</h2>

                <p className="productCard-p">
                    Chicken, tomato, cheese, and herbs
                </p>

                <div className="product-price">
                    <span>from {price} CZK</span>
                </div>

                <button className="productCard-btn">
                    <Plus size={20}/>
                    Add
                </button>
            {/*</Link>*/}
        </div>

    );
};

export default ProductCard;