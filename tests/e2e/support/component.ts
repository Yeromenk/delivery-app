import './commands'
import { mount } from 'cypress/react18'

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      mount: typeof mount
      login(email: string, password: string): Chainable<void>
      addToCart(productName: string): Chainable<void>
      clearCart(): Chainable<void>
    }
  }
}

Cypress.Commands.add('mount', mount)
