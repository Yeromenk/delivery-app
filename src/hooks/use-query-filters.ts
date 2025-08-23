import { useSearchParams } from "react-router-dom";
import type {GetSearchParams} from "../lib/find-pizzas.ts";
import { useMemo } from "react";

export const useQueryFilters = () => {
    const [searchParams] = useSearchParams();

    return useMemo((): GetSearchParams => {
        const sizes = searchParams.get('sizes');
        const pizzaTypes = searchParams.get('pizzaTypes');
        const ingredients = searchParams.get('ingredients');
        const priceFrom = searchParams.get('priceFrom');
        const priceTo = searchParams.get('priceTo');

        return {
            query: searchParams.get('query') || undefined,
            sortBy: searchParams.get('sortBy') || undefined,
            sizes: sizes || undefined,
            pizzasTypes: pizzaTypes || undefined,
            ingredients: ingredients || undefined,
            priceFrom: priceFrom || undefined,
            priceTo: priceTo || undefined,
        };
    }, [searchParams]);
};