import {useCartStore} from "../store/cart.ts";
import {useEffect} from "react";
import type {CreateCartItemValues} from "../types/cart.types.ts";
import type {CartStateItem} from "../lib/get-cart-details.ts";

type ReturnProps = {
    totalAmount: number;
    items: CartStateItem[];
    loading: boolean;
    updateItemQuantity: (id: number, quantity: number) => void;
    removeCartItem: (id: number) => void;
    addCartItem: (values: CreateCartItemValues) => void;
}

export const useCart = (): ReturnProps => {
    const {
        totalAmount,
        items: cartItems,
        fetchCartItems,
        loading,
        updateItemQuantity,
        removeCartItem,
        addCartItem
    } = useCartStore();

    useEffect(() => {
        fetchCartItems();
    }, []);

    return {
        totalAmount,
        items: cartItems,
        loading,
        updateItemQuantity,
        removeCartItem,
        addCartItem
    }
}

export default useCart