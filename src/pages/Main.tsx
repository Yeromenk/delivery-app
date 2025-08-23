import './Main.css';
import Categories from "../components/categories/Categories.tsx";
import Filters from "../components/filters/Filters.tsx";
import {ProductGroupList} from "../components/producs-group-list/ProductGroupList.tsx";
import {useProducts, type Product} from "../hooks/use-products.ts";
import {useQueryFilters} from "../hooks/use-query-filters.ts";
import ChooseProductModal from "../components/choose-product-modal/choose-product-modal.tsx";
import {useState} from 'react';

const Main = () => {
    const filters = useQueryFilters();
    const { groupedProducts, loading, categories } = useProducts(filters);

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
                            <div>Loading...</div>
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
                        {Object.entries(groupedProducts).map(([categoryId, products]) => (
                            <ProductGroupList
                                key={categoryId}
                                title={categories[Number(categoryId)] || `Category ${categoryId}`}
                                items={products}
                                categoryId={Number(categoryId)}
                                onProductClick={handleProductClick}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {isModalOpen && selectedProduct && (
                <ChooseProductModal
                    product={selectedProduct}
                    onClose={closeModal}
                />
            )}
        </main>
    );
};

export default Main;