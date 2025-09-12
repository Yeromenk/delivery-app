import axios from "axios";
import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../lib/api-config";

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
                const response = await axios.get<Ingredient[]>(API_ENDPOINTS.ingredients);
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