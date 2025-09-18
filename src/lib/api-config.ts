
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
    // Products
    products: `${API_BASE_URL}/api/products`,
    productById: (id: string | number) => `${API_BASE_URL}/api/products/${id}`,
    productSearch: (query: string) => `${API_BASE_URL}/api/products/search?query=${encodeURIComponent(query)}`,

    // Categories  
    categories: `${API_BASE_URL}/api/categories`,
    searchCategories: (params: string) => `${API_BASE_URL}/api/search/categories?${params}`,

    // Ingredients
    ingredients: `${API_BASE_URL}/api/ingredients`,

    // Cart
    cart: `${API_BASE_URL}/api/cart`,
    cartItem: (id: string | number) => `${API_BASE_URL}/api/cart/${id}`,

    // Auth
    auth: {
        me: `${API_BASE_URL}/api/auth/me`,
        login: `${API_BASE_URL}/api/auth/login`,
        register: `${API_BASE_URL}/api/auth/register`,
        logout: `${API_BASE_URL}/api/auth/logout`,
        github: (redirect: string) => `${API_BASE_URL}/api/auth/github?redirect=${encodeURIComponent(redirect)}`,
        google: (redirect: string) => `${API_BASE_URL}/api/auth/google?redirect=${encodeURIComponent(redirect)}`,
    },

    // Stories
    stories: `${API_BASE_URL}/api/stories`,

    // Payment
    paymentSuccess: `${API_BASE_URL}/api/payment-success`,
} as const;
