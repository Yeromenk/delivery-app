import {useEffect, useState} from "react";

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
    price: number;
}

interface GroupedProducts {
    [categoryId: number]: Product[];
}

export const useProducts = () => {
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState<Product[]>([]);
    const [groupedProducts, setGroupedProducts] = useState<GroupedProducts>({});

    useEffect(() => {
        async function getProducts() {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:5000/api/products');
                const data = await response.json();

                const products: Product[] = data.map((product: any) => ({
                    id: product.id,
                    name: product.name,
                    imageUrl: product.imageUrl,
                    categoryId: product.categoryId,
                    ingredients: product.ingredients || [],
                    items: product.items || [],
                    price: product.items?.[0]?.price || 150
                }));

                setItems(products);

                const grouped = products.reduce((acc, product) => {
                    if (!acc[product.categoryId]) {
                        acc[product.categoryId] = [];
                    }
                    acc[product.categoryId].push(product);
                    return acc;
                }, {} as GroupedProducts);

                setGroupedProducts(grouped);
            } catch (error) {
                console.error('Error fetching products:', error);
                setItems([]);
                setGroupedProducts({});
            } finally {
                setLoading(false);
            }
        }

        getProducts();
    }, []);

    return { items, groupedProducts, loading };
};