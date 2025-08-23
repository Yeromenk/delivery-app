import ProductCard from "../product-card/ProductCard.tsx";
import React, {useEffect, useRef} from "react";
import {useIntersection} from "react-use";
import {useCategoryStore} from "../../store/category.ts";

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
}

export const ProductGroupList: React.FC<Props> = ({
                                                      title,
                                                      items,
                                                      categoryId,
                                                      listClassName,
                                                      onProductClick
                                                  }) => {
    const setActiveId = useCategoryStore((state) => state.setActiveId);
    const intersectionRef = useRef<HTMLDivElement | null>(null);
    const intersection = useIntersection(intersectionRef, {
        threshold: 0.4,
    })

    useEffect(() => {
        if(intersection?.isIntersecting) {
            setActiveId(categoryId)
        }
    }, [categoryId, intersection?.isIntersecting, title, setActiveId]);

    return (
        <div ref={intersectionRef} id={title.toLowerCase().replace(/\s+/g, '-')}>
            <h2>
                {title}
            </h2>

            <div className={`items ${listClassName || ""}`}>
                {items.map((item) => (
                    <ProductCard
                        key={item.id}
                        id={item.id}
                        name={item.name}
                        price={item.items[0]?.price || 0}
                        imageUrl={item.imageUrl}
                        onClick={() => onProductClick?.(item)}
                    />
                ))}
            </div>
        </div>
    )
}