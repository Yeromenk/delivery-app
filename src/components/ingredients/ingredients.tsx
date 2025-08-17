import React from 'react';
import './ingredients.css';
import {CircleCheck} from "lucide-react";

interface Props {
    imageUrl?: string;
    name: string;
    price: number;
    active?: boolean;
    onClick?: () => void;
}

const Ingredients: React.FC<Props> = ({
                                          imageUrl,
                                          name,
                                          price,
                                          active,
                                          onClick,
                                      }) => {
    return (
        <div
            className={`ingredients-container ${active ? 'active' : ''}`}
            onClick={onClick}
        >
            {active && <CircleCheck className="ingredients-check" />}
            <img width={110} height={110} src={imageUrl} alt={name} />
            <span className="ingredients-name">{name}</span>
            <span className="ingredients-price">{price} CZK</span>
        </div>
    );
};

export default Ingredients;