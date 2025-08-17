import {useFilterIngredients} from "./use-filter-ingredients.ts";
import {useState} from "react";
import {useSet} from "react-use";
import {useSearchParams} from "react-router-dom";

interface IFilters {
    priceFrom?: number;
    priceTo?: number;
}

export const useFilterState = () => {
    const [searchParams] = useSearchParams();

    const {items: ingredients, loading, onAddId, selectedIds} = useFilterIngredients(
        searchParams.get('ingredients')?.split(',')
    );

    const [prices, setPrices] = useState<IFilters>({
        priceFrom: Number(searchParams.get('priceFrom')) || undefined,
        priceTo: Number(searchParams.get('priceTo')) || undefined,
    });

    const [sizes, {toggle: toggleSizes}] = useSet(
        new Set<string>(searchParams.has('sizes') ? searchParams.get('sizes')?.split(',') : [])
    );

    const [pizzaTypes, {toggle: togglePizzaTypes}] = useSet(
        new Set<string>(searchParams.has('pizzaTypes') ? searchParams.get('pizzaTypes')?.split(',') : [])
    );

    const handlePriceChange = (name: keyof IFilters, value: number) => {
        setPrices({
            ...prices,
            [name]: value,
        });
    };

    return {
        ingredients,
        loading,
        selectedIds,
        onAddId,
        prices,
        setPrices,
        handlePriceChange,
        sizes,
        toggleSizes,
        pizzaTypes,
        togglePizzaTypes
    };
};