# E2E Testing with Cypress

This directory contains End-to-End (E2E) tests for the Ye Pizza application using Cypress.

## Structure

```
tests/e2e/
├── fixtures/           # Test data files
│   └── test-data.json
├── support/            # Support files and custom commands
│   ├── commands.ts     # Custom Cypress commands
│   ├── component.ts    # Component testing support
│   └── e2e.ts         # E2E testing support
├── cart.cy.ts         # Cart functionality tests
├── checkout.cy.ts     # Checkout process tests
├── homepage.cy.ts     # Homepage tests
└── product-modal.cy.ts # Product modal tests
```

## Running Tests

### Prerequisites
- Make sure your development server is running on `http://localhost:5173`
- Ensure your backend API is running on `http://localhost:5000`
- Database should be seeded with test data

### Commands

```bash
# Open Cypress Test Runner (interactive mode)
npm run test:e2e:open

# Run all E2E tests in headless mode
npm run test:e2e

# Run E2E tests in headless mode (same as above)
npm run test:e2e:headless

# Run all tests (unit, integration, and E2E)
npm run test:all
```

## Test Coverage

### Homepage Tests (`homepage.cy.ts`)
- ✅ Homepage loading
- ✅ Product categories display
- ✅ Products grid display
- ✅ Category filtering
- ✅ Product search

### Cart Tests (`cart.cy.ts`)
- ✅ Add product to cart
- ✅ Cart drawer functionality
- ✅ Update item quantities
- ✅ Remove items from cart
- ✅ Clear entire cart

### Checkout Tests (`checkout.cy.ts`)
- ✅ Navigate to checkout
- ✅ Fill checkout form
- ✅ Order summary display
- ✅ Form validation

### Product Modal Tests (`product-modal.cy.ts`)
- ✅ Open/close modal
- ✅ Product details display
- ✅ Pizza size selection
- ✅ Price updates based on size

## Custom Commands

We've created custom Cypress commands to simplify common testing actions:

```typescript
// Login command
cy.login('email@example.com', 'password');

// Add product to cart
cy.addToCart('Product Name');

// Clear cart
cy.clearCart();
```

## Test Data

Test data is stored in `fixtures/test-data.json` and includes:
- Test user credentials
- Sample products
- Test order data

## Data Test IDs

Make sure your components include the following `data-testid` attributes for reliable testing:

### Header & Navigation
- `header` - Main header component
- `logo` - Application logo
- `search-input` - Search input field

### Categories & Products
- `categories` - Categories container
- `category-item` - Individual category items
- `products-grid` - Products grid container
- `product-card` - Individual product cards

### Cart
- `cart-button` - Cart button
- `cart-counter` - Cart items counter
- `cart-drawer` - Cart drawer/sidebar
- `cart-item` - Individual cart items
- `add-to-cart-button` - Add to cart buttons
- `clear-cart-button` - Clear cart button

### Product Modal
- `product-modal` - Product modal container
- `modal-overlay` - Modal overlay
- `close-modal` - Close modal button
- `size-option` - Pizza size options
- `add-to-cart-modal` - Add to cart from modal

### Checkout
- `checkout-form` - Checkout form
- `firstName-input`, `lastName-input`, etc. - Form inputs
- `submit-order` - Submit order button
- `order-summary` - Order summary section

## Configuration

The Cypress configuration is in `cypress.config.ts` with the following settings:

- **Base URL**: `http://localhost:5173`
- **Viewport**: 1280x720
- **Timeouts**: 10 seconds for commands and requests
- **Videos**: Disabled for faster testing
- **Screenshots**: Enabled on failure

## Best Practices

1. **Use data-testid attributes** instead of classes or IDs
2. **Keep tests independent** - each test should work in isolation
3. **Use custom commands** for repetitive actions
4. **Mock external services** when possible
5. **Test user journeys** rather than isolated components
6. **Keep tests readable** with descriptive names and comments

## Troubleshooting

### Common Issues

1. **Tests fail with element not found**
   - Ensure data-testid attributes are properly added to components
   - Check if elements are being rendered conditionally

2. **Tests timeout**
   - Increase timeout in cypress.config.ts if needed
   - Check if backend services are running

3. **Tests fail inconsistently**
   - Add proper waits with `cy.wait()` or assertions
   - Ensure test data is properly reset between tests

### Debugging

- Use `cy.debug()` or `cy.pause()` in tests for debugging
- Check browser developer tools in Cypress Test Runner
- Use `cy.screenshot()` to capture state at specific points
