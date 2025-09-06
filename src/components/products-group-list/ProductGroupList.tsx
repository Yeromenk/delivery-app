import ProductCard from "../product-card/ProductCard.tsx";
import React, { useEffect, useRef } from "react";
import { useIntersection } from "react-use";
import { useCategoryStore } from "../../store/category.ts";
import { Skeleton } from 'primereact/skeleton';

interface Ingredient {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
}

interface ProductItem {
    id: number;
    price: number;
    size?: number;
    pizzaType?: number;
}

interface Product {
    id: number;
    name: string;
    imageUrl: string;
    categoryId: number;
    ingredients: Ingredient[];
    items: ProductItem[];
}

interface Props {
    title: string;
    items: Product[];
    categoryId: number;
    listClassName?: string;
    onProductClick?: (product: Product) => void;
    loading?: boolean;
}

export const ProductGroupList: React.FC<Props> = ({
    title,
    items,
    categoryId,
    listClassName,
    onProductClick,
    loading = false
}) => {
    const setActiveId = useCategoryStore((state) => state.setActiveId);
    const intersectionRef = useRef<any>(null);
    const intersection = useIntersection(intersectionRef, {
        threshold: 0.4,
    })

    useEffect(() => {
        if (intersection?.isIntersecting) {
            setActiveId(categoryId)
        }
    }, [categoryId, intersection?.isIntersecting, title, setActiveId]);

    if (loading) {
        return (
            <div ref={intersectionRef} id={title?.toLowerCase().replace(/\s+/g, '-') || `category-${categoryId}`}>
                <h2>{title}</h2>
                <div className={`items ${listClassName || ""}`} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} style={{ background: 'white', borderRadius: '12px', padding: '1rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
                            <Skeleton width="100%" height="200px" borderRadius="8px" className="mb-3" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div ref={intersectionRef} id={title?.toLowerCase().replace(/\s+/g, '-') || `category-${categoryId}`}>
            <h2>{title}</h2>

            <div className={`items ${listClassName || ""}`}>
                {items.map((item) => (
                    <ProductCard
                        key={item.id}
                        id={item.id}
                        name={item.name}
                        price={item.items[0]?.price || 0}
                        imageUrl={item.imageUrl}
                        loading={loading}
                        ingredients={item.ingredients || []}
                        onClick={() => onProductClick?.(item)}
                    />
                ))}
            </div>
        </div>
    )
}