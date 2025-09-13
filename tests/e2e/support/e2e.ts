import './commands'

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>
      addToCart(productName: string): Chainable<void>
      clearCart(): Chainable<void>
      waitForAPI(endpoint: string): Chainable<void>
      fillCheckoutForm(formData: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        address: string;
        city?: string;
        zipCode?: string;
        comment?: string;
      }): Chainable<void>
      addPizzaToCart(pizzaName: string, size?: string): Chainable<void>
    }
  }
}

// Global beforeEach hook to run before each test
beforeEach(() => {
  // Clear local storage to ensure a clean state
  cy.window().then((win) => {
    win.localStorage.clear();
  });

  // Set up API intercepts
  cy.intercept('GET', '**/api/products*').as('getProducts');
  cy.intercept('POST', '**/api/cart*').as('addToCart');
  cy.intercept('DELETE', '**/api/cart*').as('removeFromCart');
  cy.intercept('PUT', '**/api/cart*').as('updateCart');
  cy.intercept('POST', '**/api/orders*').as('createOrder');
});
