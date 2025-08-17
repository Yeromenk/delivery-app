import type {CartItemDto} from "../types/cart.types.ts";

export const calcCartItemTotalPrice = (item: CartItemDto): number => {
    const ingredientPrice = item.ingredients.reduce((acc, ingredient) => acc + ingredient.price, 0);

    return (ingredientPrice + item.productItem.price) * item.quantity;
}