import './Main.css';
import Categories from "../components/categories/Categories.tsx";
import Filters from "../components/filters/Filters.tsx";
import {ProductGroupList} from "../components/producs-group-list/ProductGroupList.tsx";
import {useProducts} from "../hooks/use-products.ts";
import ChooseProductModal from "../components/choose-product-modal/choose-product-modal.tsx";
import React, { useState } from 'react';

// Интерфейс для Product
interface Product {
    id: number;
    name: string;
    imageUrl: string;
    categoryId: number;
    items: Array<{ price: number }>;
    ingredients: Array<{ name: string }>;
}

const Main = () => {
    const { groupedProducts, loading } = useProducts();

    // Состояние для модального окна
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleProductClick = (product: Product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
    };

    if (loading) {
        return (
            <main className="main">
                <div className="categories-section">
                    <div className="categories-content">
                        <Categories />
                    </div>
                </div>
                <div className="main-container">
                    <div className="content-container">
                        <div className="filtration">
                            <Filters />
                        </div>
                        <div className="products">
                            <div className="products-container">
                                <div className="productCard-list">
                                    <p>Loading products...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="main">
            <div className="categories-section">
                <div className="categories-content">
                    <Categories />
                </div>
            </div>
            <div className="main-container">
                <div className="content-container">
                    <div className="filtration">
                        <Filters />
                    </div>
                    <div className="products">
                        <div className="products-container">
                            <div className="productCard-list">
                                {Object.entries(groupedProducts).map(([categoryId, products]) => (
                                    <ProductGroupList
                                        key={categoryId}
                                        title={getCategoryName(Number(categoryId))}
                                        items={products}
                                        categoryId={Number(categoryId)}
                                        onProductClick={handleProductClick}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Модальное окно */}
            {isModalOpen && selectedProduct && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={closeModal}>×</button>
                        <ChooseProductModal
                            product={{
                                id: selectedProduct.id.toString(),
                                name: selectedProduct.name,
                                imageUrl: selectedProduct.imageUrl,
                                category: getCategoryName(selectedProduct.categoryId),
                                items: selectedProduct.items,
                                ingredients: selectedProduct.ingredients
                            }}
                        />
                    </div>
                </div>
            )}
        </main>
    );
};

const getCategoryName = (categoryId: number): string => {
    const categoryNames: {[key: number]: string} = {
        1: 'Pizzas',
        2: 'Snacks',
        3: 'Drinks',
        4: 'Desserts'
    };
    return categoryNames[categoryId] || 'Unknown Category';
};

export default Main;