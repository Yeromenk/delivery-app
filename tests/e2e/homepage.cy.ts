describe('Homepage E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should load the homepage successfully', () => {
    cy.get('[data-testid="header"]').should('be.visible');
    cy.get('[data-testid="logo"]').should('be.visible');
    cy.title().should('contain', 'Ye Pizza');
  });

  it('should display product categories', () => {
    cy.get('[data-testid="categories"]').should('be.visible');
    cy.get('[data-testid="category-item"]').should('have.length.greaterThan', 0);
  });

  it('should display products', () => {
    cy.get('[data-testid="products-grid"]').should('be.visible');
    cy.get('[data-testid="product-card"]').should('have.length.greaterThan', 0);
  });

  it('should filter products by category', () => {
    cy.get('[data-testid="category-item"]').first().click();
    cy.get('[data-testid="product-card"]').should('be.visible');
    cy.url().should('include', 'category');
  });

  it('should search for products', () => {
    cy.get('[data-testid="search-input"]').type('Маргарита');
    cy.get('[data-testid="product-card"]').should('contain.text', 'Маргарита');
  });
});
