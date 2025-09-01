import './Main.css';
import Categories from "../../components/categories/Categories.tsx";
import Filters from "../../components/filters/Filters.tsx";
import {ProductGroupList} from "../../components/products-group-list/ProductGroupList.tsx";
import {useProducts, type Product} from "../../hooks/use-products.ts";
import {useQueryFilters} from "../../hooks/use-query-filters.ts";
import ChooseProductModal from "../../components/choose-product-modal/choose-product-modal.tsx";
import {useState} from 'react';
import { Stories } from '../../components/stories/stories.tsx';

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

    return (
        <main className="main">
            <div className="categories-section">
                <div className="categories-content">
                    <Categories />
                </div>
            </div>
            <div className="main-container">
                 <Stories />
                <div className="content-container">

                    
                    <div className="filtration">
                        <Filters />
                    </div>
                    <div className="products">
                        {loading && Object.keys(groupedProducts).length === 0 ? (
                            Array.from({ length: 3 }).map((_, index) => (
                                <ProductGroupList
                                    key={index}
                                    title=""
                                    items={[]}
                                    categoryId={index}
                                    loading={true}
                                    onProductClick={handleProductClick}
                                />
                            ))
                        ) : (
                            Object.entries(groupedProducts).map(([categoryId, products]) => (
                                <ProductGroupList
                                    key={categoryId}
                                    title={categories[Number(categoryId)] || `Category ${categoryId}`}
                                    items={products}
                                    categoryId={Number(categoryId)}
                                    loading={loading}
                                    onProductClick={handleProductClick}
                                />
                            ))
                        )}
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