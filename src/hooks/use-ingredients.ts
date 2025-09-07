import axios from "axios";
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
                const response = await axios.get<Ingredient[]>('http://localhost:5000/api/ingredients');
                setItems(response.data);
            } catch (error) {
                console.error("[INGREDIENTS_FETCH_ERROR], ", error);
                setItems([]);
            } finally {
                setLoading(false);
            }
        }

        getIngredients();
    }, []);

    return { items, loading };
}