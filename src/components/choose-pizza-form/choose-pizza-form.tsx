import React, { useEffect, useState } from 'react';
import ProductImage from "../product-image/ProductImage.tsx";
import './choose-pizza-form.css';
import GroupVariants from "../group-variants/group-variants.tsx";
import { mapPizzaType, type PizzaSize, pizzaSizes, type PizzaType, pizzaTypes } from "../../constants/pizza.ts";
import Ingredients from "../ingredients/ingredients.tsx";
import { useSet } from "react-use";

interface Ingredient {
    id: number;
    name: string;
    imageUrl: string;
    price: number;
}

interface Props {
    imageUrl: string;
    name: string;
    loading?: boolean;
    ingredients: Ingredient[];
    items: Array<{ pizzaType?: PizzaType; price: number; size?: PizzaSize, id: number; }>;
    onClickButton: (itemId: number, ingredients: number[]) => void;
}

const ChoosePizzaForm: React.FC<Props> = ({
    imageUrl,
    name,
    loading,
    ingredients,
    onClickButton,
    items,
}) => {

    const [size, setSize] = useState<PizzaSize>(20);
    const [type, setType] = useState<PizzaType>(1);

    const [selectedIngredients, { toggle: addIngredient }] = useSet(new Set<number>([]))

    const pizzaPrice = items.find((item) => item.pizzaType === type && item.size === size)?.price ?? 0;
    const totalIngredientPrice = ingredients.filter((ingredient) => selectedIngredients.has(ingredient.id)).reduce((acc, ingredient) => acc + ingredient.price, 0);
    const totalPrice = pizzaPrice + totalIngredientPrice;

    const textDetails = `${size} cm, ${mapPizzaType[type]} pizza`;

    const handleClickAdd = () => {
        if (currentItemId) {
            onClickButton(currentItemId, Array.from(selectedIngredients));
        }
    }

    const availablePizzaTypes = items.filter((item) => item.pizzaType === type);
    const availablePizzaSizes = pizzaSizes.map((item) => ({
        name: item.name,
        value: item.value,
        isDisabled: !availablePizzaTypes.some((pizza) => Number(pizza.size) === Number(item.value))
    }))

    const currentItemId = items.find((item) => item.pizzaType === type && item.size === size)?.id;

    useEffect(() => {
        const isAvailableSize = availablePizzaSizes?.find((item) => Number(item.value) === size && !item.isDisabled);
        const availableSize = availablePizzaSizes?.find((item) => !item.isDisabled);

        if (!isAvailableSize && availableSize) {
            setSize(Number(availableSize.value) as PizzaSize);
        }
    }, [type, availablePizzaSizes, size])

    return (
        <div className="choose-pizza-form">
            <ProductImage imageUrl={imageUrl} size={size} />

            <div className="choose-pizza">
                <h1>{name}</h1>
                <p>{textDetails}</p>

                <div className="variants-section">
                    <GroupVariants
                        items={availablePizzaSizes}
                        selectedValue={String(size)}
                        onClick={value => setSize(Number(value) as PizzaSize)}
                    />

                    <GroupVariants
                        items={pizzaTypes}
                        selectedValue={String(type)}
                        onClick={value => setType(Number(value) as PizzaType)}
                    />
                </div>

                <div className="ingredients">
                    <div className="ingredients-section">
                        {ingredients.map((ingredient) => (
                            <Ingredients
                                key={ingredient.id}
                                imageUrl={ingredient.imageUrl}
                                name={ingredient.name}
                                price={ingredient.price}
                                onClick={() => addIngredient(ingredient.id)}
                                active={selectedIngredients.has(ingredient.id)}
                            />
                        ))}
                    </div>
                </div>

                <button
                    className="choose-pizza-btn"
                    onClick={handleClickAdd}
                    disabled={loading}
                >
                    {loading ? (
                        <div className="loading-spinner">
                            <div className="spinner"></div>
                            Adding...
                        </div>
                    ) : (
                        `Add to Cart for ${totalPrice} CZK`
                    )}
                </button>
            </div>
        </div>
    );
};

export default ChoosePizzaForm;