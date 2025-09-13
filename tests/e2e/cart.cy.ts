describe('Cart E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should add product to cart', () => {
    // Add first product to cart
    cy.get('[data-testid="product-card"]').first().within(() => {
      cy.get('[data-testid="add-to-cart-button"]').click();
    });

    // Verify cart counter appears
    cy.get('[data-testid="cart-counter"]').should('be.visible');
    cy.get('[data-testid="cart-counter"]').should('contain', '1');
  });

  it('should open cart drawer and display items', () => {
    // Add product to cart
    cy.get('[data-testid="product-card"]').first().within(() => {
      cy.get('[data-testid="add-to-cart-button"]').click();
    });

    // Open cart drawer
    cy.get('[data-testid="cart-button"]').click();

    // Verify cart drawer is open
    cy.get('[data-testid="cart-drawer"]').should('be.visible');
    cy.get('[data-testid="cart-item"]').should('have.length', 1);
  });

  it('should update item quantity in cart', () => {
    // Add product to cart
    cy.get('[data-testid="product-card"]').first().within(() => {
      cy.get('[data-testid="add-to-cart-button"]').click();
    });

    // Open cart and increase quantity
    cy.get('[data-testid="cart-button"]').click();
    cy.get('[data-testid="cart-item"]').first().within(() => {
      cy.get('[data-testid="increase-quantity"]').click();
    });

    // Verify quantity updated
    cy.get('[data-testid="cart-counter"]').should('contain', '2');
  });

  it('should remove item from cart', () => {
    // Add product to cart
    cy.get('[data-testid="product-card"]').first().within(() => {
      cy.get('[data-testid="add-to-cart-button"]').click();
    });

    // Open cart and remove item
    cy.get('[data-testid="cart-button"]').click();
    cy.get('[data-testid="cart-item"]').first().within(() => {
      cy.get('[data-testid="remove-item"]').click();
    });

    // Verify cart is empty
    cy.get('[data-testid="cart-counter"]').should('not.exist');
    cy.get('[data-testid="empty-cart"]').should('be.visible');
  });

  it('should clear entire cart', () => {
    // Add multiple products to cart
    cy.get('[data-testid="product-card"]').first().within(() => {
      cy.get('[data-testid="add-to-cart-button"]').click();
    });
    cy.get('[data-testid="product-card"]').eq(1).within(() => {
      cy.get('[data-testid="add-to-cart-button"]').click();
    });

    // Clear cart using custom command
    cy.clearCart();

    // Verify cart is empty
    cy.get('[data-testid="cart-counter"]').should('not.exist');
  });
});
