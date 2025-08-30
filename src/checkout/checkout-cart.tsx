import React from 'react';
import type { CartStateItem } from "../lib/get-cart-details.ts";
import CartItem from "../components/cart-item/cart-item.tsx";
import type { PizzaSize, PizzaType } from "../assets/constants/pizza.ts";
import { getCartItemsDetails } from "../lib/get-cart-items-details.ts";
import { Skeleton } from 'primereact/skeleton';

interface Props {
    items: CartStateItem[];
    onClickCountButton: (id: number, quantity: number, type: 'plus' | 'minus') => void;
    removeCartItem: (id: number) => void;
    loading?: boolean;
}

const CheckoutCart: React.FC<Props> = ({ items, removeCartItem, onClickCountButton, loading = false }) => {
    return (
        <div className="white-block">
            <div className="checkout-content">
                <h1>1. Cart</h1>

                {loading ? (
                    <div className="checkout-cart-skeleton-list">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <div key={index} className="checkout-cart-skeleton-item">
                                <Skeleton width="64px" height="64px" borderRadius="10px" />
                                <div className="checkout-cart-skeleton-middle">
                                    <Skeleton width="70%" height="1.2rem" />
                                    <Skeleton width="90%" height="1rem" />
                                </div>
                                <div className="checkout-cart-skeleton-right">
                                    <Skeleton width="80px" height="1.2rem" />
                                    <Skeleton width="110px" height="34px" borderRadius="6px" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    items.map((item) => (
                        <CartItem
                            id={item.id}
                            key={item.id}
                            name={item.name}
                            details={getCartItemsDetails(
                                item.ingredients,
                                item.pizzaType as PizzaType,
                                item.pizzaSize as PizzaSize,
                            )}
                            price={item.price}
                            imageUrl={item.imageUrl}
                            quantity={item.quantity}
                            disabled={item.disabled}
                            onClickCountButton={(type) => onClickCountButton(item.id, item.quantity, type)}
                            onClickRemove={() => removeCartItem(item.id)}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default CheckoutCart;