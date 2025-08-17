import {create} from "zustand";
import {type CartStateItem, getCartDetails} from "../lib/get-cart-details.ts";
import axios from "axios";
import { getCartToken } from "../lib/cart-token.ts";
import type {CreateCartItemValues} from "../types/cart.types.ts";

export interface CartState {
    loading: boolean;
    error: boolean;
    totalAmount: number;
    items: CartStateItem[];
    fetchCartItems: () => Promise<void>;
    updateItemQuantity: (id: number, quantity: number) => Promise<void>;
    addCartItem: (values: CreateCartItemValues) => Promise<void>;
    removeCartItem: (id: number) => Promise<void>;
}

export const useCartStore = create<CartState>()((set, get) => ({
    items: [],
    error: false,
    loading: true,
    totalAmount: 0,

    fetchCartItems: async () => {
        try {
            set({ loading: true, error: false });
            const token = getCartToken();

            const response = await axios.get('http://localhost:5000/api/cart', {
                headers: {
                    'x-cart-token': token
                }
            });

            const cartData = getCartDetails(response.data);
            set({
                items: cartData.items,
                totalAmount: cartData.totalAmount,
                loading: false
            });
        } catch (e) {
            console.error(e);
            set({ error: true, loading: false });
        }
    },

    removeCartItem: async (id: number) => {
        try {
            set({ loading: true });
            const token = getCartToken();

            await axios.delete(`http://localhost:5000/api/cart/${id}`, {
                headers: {
                    'x-cart-token': token
                }
            });

            await get().fetchCartItems();
        } catch (e) {
            console.error(e);
            set({ error: true, loading: false });
        }
    },

    updateItemQuantity: async (id: number, quantity: number) => {
        try {
            set({ loading: true });
            const token = getCartToken();

            const response = await axios.patch(`http://localhost:5000/api/cart/${id}`,
                { quantity },
                {
                    headers: {
                        'x-cart-token': token
                    }
                }
            );

            const cartData = getCartDetails(response.data);
            set({
                items: cartData.items,
                totalAmount: cartData.totalAmount,
                loading: false
            });
        } catch (e) {
            console.error(e);
            set({ error: true, loading: false });
        }
    },

    addCartItem: async (values: CreateCartItemValues) => {
        try {
            set({ loading: true, error: false });
            const token = getCartToken();

            const response = await axios.post('http://localhost:5000/api/cart', values, {
                headers: {
                    'x-cart-token': token
                }
            });

            const cartData = getCartDetails(response.data);
            set({
                items: cartData.items,
                totalAmount: cartData.totalAmount,
                loading: false
            });
        } catch (e) {
            console.error(e);
            set({ error: true, loading: false });
        }
    }
}));