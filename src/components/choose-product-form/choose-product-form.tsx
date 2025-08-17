import React from 'react';
import './choose-product-form.css';

interface Props {
    imageUrl?: string;
    name: string;
    onClickAdd?: VoidFunction;
    price: number;
    loading?: boolean;
}

const ChooseProductForm: React.FC<Props> = ({
                                                imageUrl,
                                                name,
                                                onClickAdd,
                                                loading,
                                                price
                                            }) => {

    const handleClickAdd = () => {
        onClickAdd?.();
    };

    return (
        <div className="choose-pizza-form">
            <img
                src={imageUrl}
                alt={name}
                className="choose-pizza-image"
            />

            <div className="choose-pizza">
                <h1>{name}</h1>

                <button
                    className="choose-pizza-btn"
                    onClick={handleClickAdd}
                    disabled={loading}
                >
                    {loading ? (
                        <div className="loading-spinner">
                            <div className="spinner"></div>
                            Adding...
                        </div>
                    ) : (
                        `Add to Cart for ${price} CZK`
                    )}
                </button>
            </div>
        </div>
    );
};

export default ChooseProductForm;