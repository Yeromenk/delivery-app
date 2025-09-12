import { create } from "zustand";
import { type CartStateItem, getCartDetails } from "../lib/get-cart-details.ts";
import axios from "axios";
import { getCartToken } from "../lib/cart-token.ts";
import type { CreateCartItemValues } from "../types/cart.types.ts";
import { API_ENDPOINTS } from "../lib/api-config";

export interface CartState {
    loading: boolean;
    error: boolean;
    totalAmount: number;
    items: CartStateItem[];
    fetchCartItems: () => Promise<void>;
    updateItemQuantity: (id: number, quantity: number) => Promise<void>;
    addCartItem: (values: CreateCartItemValues) => Promise<void>;
    removeCartItem: (id: number) => Promise<void>;
    clearCart: () => Promise<void>;
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

            const response = await axios.get(API_ENDPOINTS.cart, {
                headers: {
                    'x-cart-token': token
                }
            });

            const cartData = getCartDetails(response.data);

            if (cartData.items.some(item => !item.name || !item.id || item.price < 0)) {
                console.warn("[CART_DATA_INCONSISTENCY] Found invalid cart items, clearing cart");
                await get().clearCart();
                return;
            }

            set({
                items: cartData.items,
                totalAmount: cartData.totalAmount,
                loading: false
            });
        } catch (e) {
            console.error("[CART_FETCH_ERROR]", e);

            if (axios.isAxiosError(e) && (e.response?.status === 404 || e.response?.status === 400)) {
                console.warn("[CART_TOKEN_INVALID] Clearing cart due to invalid token");
                await get().clearCart();
            } else {
                set({ error: true, loading: false });
            }
        }
    },

    removeCartItem: async (id: number) => {
        try {
            set({ loading: true });
            const token = getCartToken();

            await axios.delete(API_ENDPOINTS.cartItem(id), {
                headers: {
                    'x-cart-token': token
                }
            });

            await get().fetchCartItems();
        } catch (e) {
            console.error("[CART_REMOVE_ERROR]", e);
            set({ error: true, loading: false });
        }
    },

    updateItemQuantity: async (id: number, quantity: number) => {
        try {
            set({ loading: true });
            const token = getCartToken();

            const response = await axios.patch(API_ENDPOINTS.cartItem(id),
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
            console.error("[CART_UPDATE_ERROR]", e);
            set({ error: true, loading: false });
        }
    },

    addCartItem: async (values: CreateCartItemValues) => {
        try {
            set({ loading: true, error: false });
            const token = getCartToken();

            const response = await axios.post(API_ENDPOINTS.cart, values, {
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
            console.error("[CART_ADD_ERROR]", e);
            set({ error: true, loading: false });
        }
    },

    clearCart: async () => {
        try {
            set({ loading: true, error: false });

            localStorage.removeItem('cartToken');

            set({
                items: [],
                totalAmount: 0,
                loading: false,
                error: false
            });

            console.log("[CART_CLEARED] Cart has been cleared");
        } catch (e) {
            console.error("[CART_CLEAR_ERROR]", e);
            set({ error: true, loading: false });
        }
    }
}));