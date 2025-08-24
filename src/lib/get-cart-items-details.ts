import { mapPizzaType, type PizzaSize, type PizzaType } from '../assets/constants/pizza.ts';
import type {CartStateItem} from "./get-cart-details.ts";

export const getCartItemsDetails = (
    ingredients: CartStateItem["ingredients"],
    pizzaType?: PizzaType ,
    pizzaSize?: PizzaSize
): string => {
    const details: string[] = [];

    if (pizzaSize && pizzaType) {
        const typeName = mapPizzaType[pizzaType];
        details.push(`${typeName}: ${pizzaSize} cm`);
    }

    if (ingredients && ingredients.length > 0) {
        details.push(...ingredients.map((i) => i.name));
    }

    return details.join(', ');
};