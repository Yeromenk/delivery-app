import axios from "axios";

export interface GetSearchParams {
    query?: string;
    sortBy?: string;
    sizes?: string;
    pizzasTypes?: string;
    ingredients?: string;
    priceFrom?: string;
    priceTo?: string;
}

const DEFAULT_MIN_PRICE = 0;
const DEFAULT_MAX_PRICE = 1000;

export const findPizzas = async (params: GetSearchParams) => {
    const sizes = params.sizes?.split(',').map(Number);
    const pizzasTypes = params.pizzasTypes?.split(',').map(Number);
    const ingredients = params.ingredients?.split(',').map(Number);

    const minPrice = Number(params.priceFrom) || DEFAULT_MIN_PRICE;
    const maxPrice = Number(params.priceTo) || DEFAULT_MAX_PRICE;

    try {
        const searchParams = new URLSearchParams();

        if (params.query) searchParams.append('query', params.query);
        if (params.sortBy) searchParams.append('sortBy', params.sortBy);
        if (sizes?.length) searchParams.append('sizes', sizes.join(','));
        if (pizzasTypes?.length) searchParams.append('pizzasTypes', pizzasTypes.join(','));
        if (ingredients?.length) searchParams.append('ingredients', ingredients.join(','));

        searchParams.append('priceFrom', minPrice.toString());
        searchParams.append('priceTo', maxPrice.toString());

        const response = await axios.get(`http://localhost:5000/api/search/categories?${searchParams}`);

        if (!response.data) {
            throw new Error('Failed to fetch categories');
        }

        return response.data;

    } catch (error) {
        console.error("[FIND_PIZZAS_ERROR]", error);
        throw error;
    }
};