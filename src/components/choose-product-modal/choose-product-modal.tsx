import React from "react";
import './choose-product-modal.css';
import ChoosePizzaForm from "../choose-pizza-form/choose-pizza-form.tsx";
import ChooseProductForm from "../choose-product-form/choose-product-form.tsx";
import type { PizzaSize, PizzaType } from "../../constants/pizza.ts";
import { useCartStore } from "../../store/cart.ts";
import toast from "react-hot-toast";

interface Ingredient {
    id: number;
    name: string;
    imageUrl: string;
    price: number;
}

interface ProductItem {
    id: number;
    price: number;
    size?: PizzaSize;
    pizzaType?: PizzaType;
}

interface Product {
    id: string;
    name: string;
    imageUrl: string;
    category: string;
    items: ProductItem[];
    ingredients: Ingredient[];
}

interface Props {
    product: Product;
    onClose?: () => void;
}

const ChooseProductModal: React.FC<Props> = ({ product, onClose }) => {
    const firstItem = product.items[0];
    const isPizzaForm = Boolean(firstItem.pizzaType);

    const addCartItem = useCartStore((state) => state.addCartItem);
    const loading = useCartStore((state) => state.loading);

    const onAddProduct = async () => {
        try {
            await addCartItem({
                productItemId: firstItem.id,
            });
            toast.success("Product added successfully.");
            onClose?.();
        } catch (e) {
            console.error("[ADD_PRODUCT_ERROR], ", e);
            toast.error("Failed to add product");
        }
    }

    const onAddPizza = async (productItemId: number, ingredients: number[]) => {
        try {
            await addCartItem({
                productItemId,
                ingredients,
            })
            toast.success("Pizza added successfully.");
            onClose?.();
        } catch (e) {
            console.error("[ADD_PIZZA_ERROR], ", e);
            toast.error("Failed to add pizza");
        }
    }

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose?.();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick} data-testid="modal-overlay">
            <div className="modal-content" data-testid="product-modal">
                <button className="modal-close" onClick={onClose} data-testid="close-modal">
                    ×
                </button>
                <div className="choose-product-modal">
                    <div className="modal-body">
                        {isPizzaForm ? (
                            <ChoosePizzaForm
                                imageUrl={product.imageUrl}
                                name={product.name}
                                ingredients={product.ingredients}
                                items={product.items}
                                onClickButton={onAddPizza}
                                loading={loading}
                            />
                        ) : (
                            <ChooseProductForm
                                imageUrl={product.imageUrl}
                                name={product.name}
                                price={firstItem.price}
                                ingredients={product.ingredients}
                                onClickAdd={onAddProduct}
                                loading={loading}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChooseProductModal;