// TODO delete later this file
// src/lib/cart-token.ts
const CART_TOKEN_KEY = 'cartToken';

export const getCartToken = (): string => {
    let token = localStorage.getItem(CART_TOKEN_KEY);
    if (!token) {
        // Используем один из токенов из seed.ts для тестирования
        token = 'user_cart_token_001'; // или 'admin_cart_token_002'
        localStorage.setItem(CART_TOKEN_KEY, token);
    }
    return token;
};

export const setCartToken = (token: string): void => {
    localStorage.setItem(CART_TOKEN_KEY, token);
};