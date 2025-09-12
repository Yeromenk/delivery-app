const CART_TOKEN_KEY = 'cartToken';

export const getCartToken = (): string => {
    let token = localStorage.getItem(CART_TOKEN_KEY);
    if (!token) {
        token = 'user_cart_token_001';
        localStorage.setItem(CART_TOKEN_KEY, token);
    }
    return token;
};

export const setCartToken = (token: string): void => {
    localStorage.setItem(CART_TOKEN_KEY, token);
};