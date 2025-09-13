describe('Checkout E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/');
    // Add product to cart before each test
    cy.get('[data-testid="product-card"]').first().within(() => {
      cy.get('[data-testid="add-to-cart-button"]').click();
    });
  });

  it('should navigate to checkout page', () => {
    cy.get('[data-testid="cart-button"]').click();
    cy.get('[data-testid="checkout-button"]').click();

    cy.url().should('include', '/checkout');
    cy.get('[data-testid="checkout-form"]').should('be.visible');
  });

  it('should fill checkout form and proceed to payment', () => {
    // Navigate to checkout
    cy.get('[data-testid="cart-button"]').click();
    cy.get('[data-testid="checkout-button"]').click();

    // Fill personal information
    cy.get('[data-testid="firstName-input"]').type('Jan');
    cy.get('[data-testid="lastName-input"]').type('Novák');
    cy.get('[data-testid="email-input"]').type('jan.novak@example.com');
    cy.get('[data-testid="phone-input"]').type('+420123456789');

    // Fill address
    cy.get('[data-testid="address-input"]').type('Testovací ulice 123');
    cy.get('[data-testid="city-input"]').type('Praha');
    cy.get('[data-testid="zipCode-input"]').type('10000');

    // Add comment
    cy.get('[data-testid="comment-input"]').type('Testovací objednávka');

    // Submit form
    cy.get('[data-testid="submit-order"]').click();

    // Should redirect to Stripe payment page
    cy.url().should('include', 'stripe.com');
  });

  it('should display order summary correctly', () => {
    cy.get('[data-testid="cart-button"]').click();
    cy.get('[data-testid="checkout-button"]').click();

    // Verify order summary
    cy.get('[data-testid="order-summary"]').should('be.visible');
    cy.get('[data-testid="order-item"]').should('have.length.greaterThan', 0);
    cy.get('[data-testid="total-amount"]').should('be.visible');
    cy.get('[data-testid="total-amount"]').should('not.contain', '0 CZK');
  });

  it('should validate required fields', () => {
    cy.get('[data-testid="cart-button"]').click();
    cy.get('[data-testid="checkout-button"]').click();

    // Try to submit empty form
    cy.get('[data-testid="submit-order"]').click();

    // Check for validation errors
    cy.get('[data-testid="firstName-error"]').should('be.visible');
    cy.get('[data-testid="lastName-error"]').should('be.visible');
    cy.get('[data-testid="email-error"]').should('be.visible');
    cy.get('[data-testid="phone-error"]').should('be.visible');
  });
});
