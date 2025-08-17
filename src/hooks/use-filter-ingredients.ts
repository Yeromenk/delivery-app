import {useSet} from "react-use";
import {useIngredients} from "./use-ingredients.ts";

interface Ingredient {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
}

interface ReturnProps {
    items: Ingredient[];
    loading: boolean;
    selectedIds: Set<string>;
    onAddId: (id: string) => void;
}

export const useFilterIngredients = (values: string[] = []): ReturnProps => {
    const {items, loading} = useIngredients();
    const [selectedIds, {toggle}] = useSet(new Set<string>(values));

    return {
        items,
        loading,
        selectedIds,
        onAddId: toggle
    };
};