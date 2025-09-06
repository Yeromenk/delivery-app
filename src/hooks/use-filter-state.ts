import { useFilterIngredients } from "./use-filter-ingredients.ts";
import { useState, useEffect } from "react";
import { useSet } from "react-use";
import { useSearchParams } from "react-router-dom";

interface IFilters {
    priceFrom?: number;
    priceTo?: number;
}

export const useFilterState = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const { items: ingredients, loading, onAddId, selectedIds } = useFilterIngredients(
        searchParams.get('ingredients')?.split(',') || []
    );

    const [prices, setPrices] = useState<IFilters>({
        priceFrom: Number(searchParams.get('priceFrom')) || undefined,
        priceTo: Number(searchParams.get('priceTo')) || undefined,
    });

    const [sizes, { toggle: toggleSizes }] = useSet(
        new Set<string>(searchParams.get('sizes')?.split(',') || [])
    );

    const [pizzaTypes, { toggle: togglePizzaTypes }] = useSet(
        new Set<string>(searchParams.get('pizzaTypes')?.split(',') || [])
    );

    const handlePriceChange = (name: keyof IFilters, value: number) => {
        setPrices(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    useEffect(() => {
        const newSearchParams = new URLSearchParams();

        if (prices.priceFrom) {
             newSearchParams.set('priceFrom', String(prices.priceFrom));
        }

        if (prices.priceTo) {
            newSearchParams.set('priceTo', String(prices.priceTo));
        }

        if (sizes.size > 0) {
            newSearchParams.set('sizes', Array.from(sizes).join(','));
        }

        if (pizzaTypes.size > 0) {
            newSearchParams.set('pizzaTypes', Array.from(pizzaTypes).join(','));
        }

        if (selectedIds.size > 0) {
            newSearchParams.set('ingredients', Array.from(selectedIds).join(','));
        }

        setSearchParams(newSearchParams, { replace: true });
    }, [prices, sizes, pizzaTypes, selectedIds, setSearchParams]);

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