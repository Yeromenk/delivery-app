import React from 'react';
import { useParams } from 'react-router-dom';
import { useProduct } from '../../hooks/use-product';
import ChoosePizzaForm from '../../components/choose-pizza-form/choose-pizza-form';
import ChooseProductForm from '../../components/choose-product-form/choose-product-form';
import NotFound from '../../components/not-found-page/NotFound';
import { ArrowLeft } from 'lucide-react';
import { useCartStore } from '../../store/cart';
import toast from 'react-hot-toast';
import './ProductPage.css';

const ProductPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { product, loading: productLoading, error } = useProduct(id || '');
    const addCartItem = useCartStore((state) => state.addCartItem);
    const loading = useCartStore((state) => state.loading);

    if (!id) return <NotFound />;

    if (productLoading) {
        return (
            <div className="product-page">
                <div className="product-page-loading">
                    <div className="loading-spinner">Loading product...</div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return <NotFound />;
    }

    const firstItem = product.items[0];
    const isPizzaForm = Boolean(firstItem.pizzaType);

    const handleGoBack = () => {
        window.history.back();
    };

    const handleAddToCart = async (itemId: number, ingredients: number[] = []) => {
        try {
            await addCartItem({
                productItemId: itemId,
                ingredients
            });
            toast.success("Product added to cart successfully!");
        } catch (error) {
            console.error('Error adding to cart:', error);
            toast.error("Failed to add product to cart");
        }
    };

    return (
        <div className="product-page">
            <div className="product-page-container">
                <div className="product-page-header">
                    <button onClick={handleGoBack} className="back-button">
                        <ArrowLeft size={20} />
                        Back
                    </button>
                </div>

                <div className="product-page-content">
                    <div className="product-page-form">
                        {isPizzaForm ? (
                            <ChoosePizzaForm
                                imageUrl={product.imageUrl}
                                name={product.name}
                                ingredients={product.ingredients}
                                items={product.items as Array<{
                                    id: number;
                                    price: number;
                                    size?: 20 | 30 | 40;
                                    pizzaType?: 1 | 2;
                                }>}
                                onClickButton={handleAddToCart}
                                loading={loading}
                            />
                        ) : (
                            <ChooseProductForm
                                imageUrl={product.imageUrl}
                                name={product.name}
                                price={firstItem.price}
                                ingredients={product.ingredients}
                                onClickAdd={() => handleAddToCart(firstItem.id)}
                                loading={loading}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;
