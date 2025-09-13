// Command to log in a user
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login');
  cy.get('[data-testid="email-input"]').type(email);
  cy.get('[data-testid="password-input"]').type(password);
  cy.get('[data-testid="login-button"]').click();
  cy.url().should('not.include', '/login');
});

// Command to add a product to the cart by product name
Cypress.Commands.add('addToCart', (productName: string) => {
  cy.contains('[data-testid="product-card"]', productName).within(() => {
    cy.get('[data-testid="add-to-cart-button"]').click();
  });
  cy.get('[data-testid="cart-counter"]').should('be.visible');
});

// Command to clear the cart
Cypress.Commands.add('clearCart', () => {
  cy.get('[data-testid="cart-button"]').click();
  cy.get('[data-testid="cart-drawer"]').should('be.visible');

  // Check if there are items in the cart
  cy.get('body').then(($body) => {
    if ($body.find('[data-testid="cart-item"]').length > 0) {
      // Remove all items from the cart
      cy.get('[data-testid="cart-item"]').each(() => {
        cy.get('[data-testid="cart-item"]').first().within(() => {
          cy.get('[data-testid="remove-item"]').click();
        });
      });
    }
  });

  // Check that the cart is empty
  cy.get('[data-testid="empty-cart"]').should('be.visible');
});

// Command to wait for a specific API call to complete
Cypress.Commands.add('waitForAPI', (endpoint: string) => {
  cy.intercept('GET', `**/api/${endpoint}`).as(`get${endpoint}`);
  cy.wait(`@get${endpoint}`);
});

// Command to fill out the checkout form
Cypress.Commands.add('fillCheckoutForm', (formData: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city?: string;
  zipCode?: string;
  comment?: string;
}) => {
  cy.get('[data-testid="firstName-input"]').type(formData.firstName);
  cy.get('[data-testid="lastName-input"]').type(formData.lastName);
  cy.get('[data-testid="email-input"]').type(formData.email);
  cy.get('[data-testid="phone-input"]').type(formData.phone);
  cy.get('[data-testid="address-input"]').type(formData.address);

  if (formData.city) {
    cy.get('[data-testid="city-input"]').type(formData.city);
  }

  if (formData.zipCode) {
    cy.get('[data-testid="zipCode-input"]').type(formData.zipCode);
  }

  if (formData.comment) {
    cy.get('[data-testid="comment-input"]').type(formData.comment);
  }
});

// Command to add a pizza to the cart with optional size selection
Cypress.Commands.add('addPizzaToCart', (pizzaName: string, size?: string) => {
  cy.contains('[data-testid="product-card"]', pizzaName).click();
  cy.get('[data-testid="product-modal"]').should('be.visible');

  if (size) {
    cy.contains('[data-testid="size-option"]', size).click();
  }

  cy.get('[data-testid="add-to-cart-modal"]').click();
  cy.get('[data-testid="product-modal"]').should('not.exist');
  cy.get('[data-testid="cart-counter"]').should('be.visible');
});
