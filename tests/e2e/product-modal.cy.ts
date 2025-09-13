describe('Product Modal E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should open product modal when clicking on product', () => {
    cy.get('[data-testid="product-card"]').first().click();

    cy.get('[data-testid="product-modal"]').should('be.visible');
    cy.get('[data-testid="modal-overlay"]').should('be.visible');
  });

  it('should display product details in modal', () => {
    cy.get('[data-testid="product-card"]').first().click();

    cy.get('[data-testid="product-modal"]').within(() => {
      cy.get('[data-testid="product-name"]').should('be.visible');
      cy.get('[data-testid="product-image"]').should('be.visible');
      cy.get('[data-testid="product-ingredients"]').should('be.visible');
      cy.get('[data-testid="product-price"]').should('be.visible');
    });
  });

  it('should close modal when clicking outside or close button', () => {
    cy.get('[data-testid="product-card"]').first().click();
    cy.get('[data-testid="product-modal"]').should('be.visible');

    // Close with close button
    cy.get('[data-testid="close-modal"]').click();
    cy.get('[data-testid="product-modal"]').should('not.exist');

    // Open again and close with overlay click
    cy.get('[data-testid="product-card"]').first().click();
    cy.get('[data-testid="modal-overlay"]').click({ force: true });
    cy.get('[data-testid="product-modal"]').should('not.exist');
  });

  it('should select pizza size and add to cart from modal', () => {
    // Click on pizza product
    cy.get('[data-testid="product-card"]').contains('пицца').first().click();

    cy.get('[data-testid="product-modal"]').within(() => {
      // Select size
      cy.get('[data-testid="size-option"]').contains('Средняя').click();

      // Add to cart
      cy.get('[data-testid="add-to-cart-modal"]').click();
    });

    // Verify product added to cart
    cy.get('[data-testid="cart-counter"]').should('be.visible');
    cy.get('[data-testid="product-modal"]').should('not.exist');
  });

  it('should update price when selecting different pizza size', () => {
    cy.get('[data-testid="product-card"]').contains('пицца').first().click();

    cy.get('[data-testid="product-modal"]').within(() => {
      // Get initial price
      cy.get('[data-testid="product-price"]').then(($price) => {
        const initialPrice = $price.text();

        // Select different size
        cy.get('[data-testid="size-option"]').contains('Большая').click();

        // Price should change
        cy.get('[data-testid="product-price"]').should('not.contain', initialPrice);
      });
    });
  });
});
