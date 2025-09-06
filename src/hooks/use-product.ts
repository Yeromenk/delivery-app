import { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';

interface Ingredient {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
}

interface ProductItem {
    id: number;
    price: number;
    size?: number;
    pizzaType?: number;
}

interface Product {
    id: number;
    name: string;
    imageUrl: string;
    categoryId: number;
    ingredients: Ingredient[];
    items: ProductItem[];
}

export const useProduct = (id: string | number) => {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:5000/api/products/${id}`);

                setProduct(response.data);
                setError(null);
            } catch (err) {
                if (err instanceof AxiosError) {
                    if (err.response?.status === 404) {
                        setError('Product not found');
                    } else {
                        setError(err.response?.data?.message || 'Failed to fetch product');
                    }
                } else {
                    setError(err instanceof Error ? err.message : 'Failed to fetch product');
                }
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    return { product, loading, error };
};