const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiConfig = {
  baseURL: API_BASE_URL,
  endpoints: {
    products: '/products',
    categories: '/categories',
    ingredients: '/ingredients',
    cart: '/cart',
    orders: '/orders',
    search: '/search',
  }
};

export const getApiUrl = (endpoint: string) => {
  return `${API_BASE_URL}${endpoint}`;
};

export default apiConfig;
