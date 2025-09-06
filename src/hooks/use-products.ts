import { useEffect, useState } from "react";
import { findPizzas, type GetSearchParams } from "../lib/find-pizzas.ts";
import axios from "axios";

export interface Ingredient {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
}

export interface ProductItem {
    id: number;
    price: number;
    size?: number;
    pizzaType?: number;
}

export interface Product {
    id: number;
    name: string;
    imageUrl: string;
    categoryId: number;
    ingredients: Ingredient[];
    items: ProductItem[];
}

interface Category {
    id: number;
    name: string;
    products: Product[];
}

interface GroupedProducts {
    [categoryId: number]: Product[];
}

export const useProducts = (filters?: GetSearchParams) => {
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState<Product[]>([]);
    const [groupedProducts, setGroupedProducts] = useState<GroupedProducts>({});
    const [categories, setCategories] = useState<{ [id: number]: string }>({});

    useEffect(() => {
        async function getProducts() {
            try {
                setLoading(true);

                const hasActiveFilters = filters && Object.values(filters).some(value =>
                    value !== undefined && value !== '' && value !== '0' && value !== '1000'
                );

                let categoriesData: Category[] = [];

                if (hasActiveFilters) {
                    categoriesData = await findPizzas(filters);
                } else {
                    const response = await axios.get('http://localhost:5000/api/categories');
                    if (response.status === 200) {
                        categoriesData = response.data;
                    } else {
                        throw new Error('Failed to fetch categories');
                    }
                }

                const categoryNames: { [id: number]: string } = {};
                const allProducts: Product[] = [];
                const grouped: GroupedProducts = {};

                if (Array.isArray(categoriesData) && categoriesData.length > 0) {
                    categoriesData.forEach(category => {
                        if (category?.id && category?.name) {
                            categoryNames[category.id] = category.name;
                            if (category.products && Array.isArray(category.products)) {
                                grouped[category.id] = category.products;
                                allProducts.push(...category.products);
                            }
                        }
                    });
                }

                setItems(allProducts);
                setGroupedProducts(grouped);
                setCategories(categoryNames);
            } catch (error) {
                console.error("[PRODUCTS_FETCH_ERROR], ", error);
                setItems([]);
                setGroupedProducts({});
                setCategories({});
            } finally {
                setLoading(false);
            }
        }

        getProducts();
    }, [filters]);

    return { items, groupedProducts, loading, categories };
};