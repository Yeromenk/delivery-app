import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import CartButton from '../../src/components/cart-button/cart-button';
import { useCartStore } from '../../src/store/cart';
import React from "react";

// Mock the API config to avoid import.meta.env issues
jest.mock('../../src/lib/api-config', () => ({
    API_BASE_URL: 'http://localhost:5000',
    API_ENDPOINTS: {
        paymentSuccess: 'http://localhost:5000/api/payment-success',
    },
}));

// Mock the cart store
jest.mock('../../src/store/cart', () => ({
    useCartStore: jest.fn(),
}));

// Mock the CartDrawer component
jest.mock('../../src/components/cart-drawer/cart-drawer', () => {
    return function MockCartDrawer({ children }: { children: React.ReactNode }) {
        return <div data-testid="cart-drawer">{children}</div>;
    };
});

const mockUseCartStore = useCartStore as jest.MockedFunction<typeof useCartStore>;

describe('CartButton', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders cart button with correct amount and item count', () => {
        // Mock the Zustand selector pattern
        mockUseCartStore.mockImplementation((selector: any) => {
            const state = {
                totalAmount: 150,
                items: [{ id: 1 }, { id: 2 }],
                loading: false,
                error: false,
                fetchCartItems: jest.fn(),
                updateItemQuantity: jest.fn(),
                addCartItem: jest.fn(),
                removeCartItem: jest.fn(),
                clearCart: jest.fn(),
            };
            return selector(state);
        });

        render(<CartButton />);

        expect(screen.getByText('150 CZK')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
        expect(screen.getByLabelText('Open cart')).toBeInTheDocument();
    });

    test('shows loading state when loading is true', () => {
        // Mock the Zustand selector pattern for loading state
        mockUseCartStore.mockImplementation((selector: never) => {
            const state = {
                totalAmount: 150,
                items: [{ id: 1 }],
                loading: true,
                error: false,
                fetchCartItems: jest.fn(),
                updateItemQuantity: jest.fn(),
                addCartItem: jest.fn(),
                removeCartItem: jest.fn(),
                clearCart: jest.fn(),
            };
            return selector(state);
        });

        render(<CartButton />);

        expect(screen.getByRole('button')).toHaveClass('loading');
        expect(screen.getByRole('button', { name: 'Open cart' })).toBeInTheDocument();
    });
})