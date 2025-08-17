import {useEffect, useState} from "react";

interface Ingredient {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
}

export const useIngredients = () => {
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState<Ingredient[]>([]);

    useEffect(() => {
        async function getIngredients() {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:5000/api/ingredients');
                const data = await response.json();

                setItems(data);
            } catch (error) {
                console.error('Error fetching ingredients:', error);
                setItems([]);
            } finally {
                setLoading(false);
            }
        }

        getIngredients();
    }, []);

    return { items, loading };
}