export interface CartItemDto {
    id: number;
    quantity: number;
    createdAt: string;
    productItem: {
        id: number;
        price: number;
        size: number | null;
        pizzaType: number | null;
        product: {
            id: number;
            name: string;
            imageUrl: string;
            categoryId: number;
        };
    };
    ingredients: Array<{
        id: number;
        name: string;
        price: number;
        imageUrl: string;
    }>;
}