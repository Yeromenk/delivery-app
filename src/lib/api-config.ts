const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  products: '/products',
  categories: '/categories',
  ingredients: '/ingredients',
  cart: '/cart',
  orders: '/orders',
  search: '/search',
  productSearch: (query: string) => `/search/categories?q=${encodeURIComponent(query)}`,
  paymentSuccess: '/payment-success',
  cartItem: (id: number) => `/cart/${id}`,
};

export const apiConfig = {
  baseURL: API_BASE_URL,
  endpoints: API_ENDPOINTS
};

export const getApiUrl = (endpoint: string) => {
  return `${API_BASE_URL}${endpoint}`;
};

export default apiConfig;
