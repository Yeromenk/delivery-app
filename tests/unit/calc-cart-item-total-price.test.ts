import { calcCartItemTotalPrice } from '../../back-end/lib/calc-cart-item-total-price';
import type { CartItemDto } from '../../back-end/types/cart.types';

describe('calcCartItemTotalPrice', () => {
  test('should calculate total price correctly with ingredients', () => {
    const mockCartItem: CartItemDto = {
      id: 1,
      quantity: 2,
      createdAt: '2024-01-01',
      productItem: {
        id: 1,
        price: 100,
        pizzaType: 1,
        size: 20,
        product: {
          id: 1,
          name: 'Маргарита',
          imageUrl: '/images/pizza-1.png',
          categoryId: 1
        }
      },
      ingredients: [
        { id: 1, name: 'Сыр', price: 30, imageUrl: '' },
        { id: 2, name: 'Помидоры', price: 20, imageUrl: '' }
      ]
    };

    const result = calcCartItemTotalPrice(mockCartItem);

    // (100 + 30 + 20) * 2 = 300
    expect(result).toBe(300);
  });

  test('should calculate total price correctly without ingredients', () => {
    const mockCartItem: CartItemDto = {
      id: 1,
      quantity: 1,
      createdAt: '2024-01-01',
      productItem: {
        id: 1,
        price: 150,
        pizzaType: 1,
        size: 30,
        product: {
          id: 1,
          name: 'Пепперони',
          imageUrl: '/images/pizza-2.png',
          categoryId: 1
        }
      },
      ingredients: []
    };

    const result = calcCartItemTotalPrice(mockCartItem);

    // 150 * 1 = 150
    expect(result).toBe(150);
  });

  test('should handle zero quantity', () => {
    const mockCartItem: CartItemDto = {
      id: 1,
      quantity: 0,
      createdAt: '2024-01-01',
      productItem: {
        id: 1,
        price: 100,
        pizzaType: 1,
        size: 20,
        product: {
          id: 1,
          name: 'Маргарита',
          imageUrl: '/images/pizza-1.png',
          categoryId: 1
        }
      },
      ingredients: [
        { id: 1, name: 'Сыр', price: 50, imageUrl: '' }
      ]
    };

    const result = calcCartItemTotalPrice(mockCartItem);

    // (100 + 50) * 0 = 0
    expect(result).toBe(0);
  });
});
