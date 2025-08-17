import React from "react";

interface ItemDetails {
    src: string;
}

export const CartItemDetailsImage: React.FC<ItemDetails> = ({ src }) => {
    return (
            <img src={src} alt="Cart Item"  style={{width: "60px", height: "60px"} } />
    );
};