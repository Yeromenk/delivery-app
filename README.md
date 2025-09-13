# 🍕 Ye Pizza — Pizza Delivery Web App

A modern React + TypeScript application with a full e‑commerce flow: product catalog, advanced filtering, shopping cart, and checkout. The project is split into a Vite + React frontend and an Express + PostgreSQL backend, with Stripe Checkout and email notifications via Resend.

---

## Features

- Category‑based catalog (pizzas, snacks, drinks, desserts)
- Filtering: ingredients, price range, sizes/types, sorting
- Searching products by name
- Product details with images, descriptions, ingredients
- Shopping cart with add/remove, quantity updates, totals
- Order placement with redirect to Stripe Checkout
- Email notifications (Resend), consistent skeletons/spinners for loading
- Responsive UI and polished interactions

---

## Tech stack 

- ## Frontend:
- [React 18](https://react.dev), 
- [TypeScript](https://www.typescriptlang.org/),
- [Vite](https://vite.dev), 
- [React Router](https://reactrouter.com/), 
- [Zustand](https://github.com/pmndrs/zustand),
- [React Hook Form](https://react-hook-form.com/),
- [PrimeReact](https://primereact.org), 
- [Lucide Icons](https://lucide.dev)
- ## Backend: 
- [Node.js](https://nodejs.org/), 
- [Express](https://expressjs.com/),
- [PostgreSQL](https://www.postgresql.org/),
- [Stripe](https://stripe.com/docs), 
- [Resend](https://resend.com)
- ##  Styling:
- [CSS](https://developer.mozilla.org/docs/Web/CSS)
- ## Dev tools: 
- [ESLint](https://eslint.org), 
- [TypeScript](https://www.typescriptlang.org/), 
- [nodemon](https://nodemon.io),
- [ts-node](https://typestrong.org/ts-node/)
- ## Testing:
- [Jest](https://jestjs.io/),
- [Cypress](https://www.cypress.io/),
- ## Deployment:
- [Docker](https://www.docker.com/),
- [GitHub Actions](https:://github.com/features/actions)

---

## Prerequisites

- Node.js 18+ (LTS recommended)
- PostgreSQL 14+
- Keys for Stripe and Resend (to test checkout and emails end‑to‑end)

---

## Setup

Install dependencies.

- Frontend (repo root):
```powershell
npm install
```

- Backend (`back-end/`):
```powershell
cd back-end
npm install
```

### Backend environment
Create `back-end/.env`:
```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ye_pizza
DB_USER=postgres
DB_PASSWORD=postgres

# Integrations
STRIPE_API_KEY=sk_test_xxx
RESEND_API_KEY=re_xxx
```
Notes:
- CORS in `back-end/server.ts` is set to `http://localhost:5173`.
- If you change the frontend URL or port, update CORS and success/cancel URLs in `routes/create-order.ts`.

### Initialize the database
Create a database named `ye_pizza`, then run:
```powershell
cd back-end
npm run build
npm run create-schema
npm run seed
```
This will create tables from `database/schema.sql` and seed demo data from `database/seed.ts` (prices in CZK).

### Run in development
- Backend:
```powershell
cd back-end
npm run dev
```
- Frontend (in another terminal from the repo root):
```powershell
npm run dev
```

Frontend: http://localhost:5173
Backend API: http://localhost:5000/api

---

## Testing

This project includes comprehensive testing with unit tests, integration tests, and E2E tests.

### Test Commands

```bash
# Run all unit tests
npm run test:unit

# Run integration tests
npm run test:integration

# Run E2E tests (requires manual server setup)
npm run test:e2e

# Run E2E tests with automatic server startup
npm run test:e2e:full

# Run all tests
npm run test:all

# Run tests with coverage
npm run test:coverage
```

### CI/CD Pipeline

The project includes a GitHub Actions CI/CD pipeline that:
- Runs unit tests
- Runs integration tests with PostgreSQL database
- Builds the application
- Runs E2E tests with Cypress
- Builds Docker images for deployment

### Docker Support

Both frontend and backend are containerized with Docker:
- Backend: Node.js with TypeScript compilation
- Frontend: Nginx serving built React app
- Database: PostgreSQL

### Test Structure

- `tests/unit/` - Unit tests for individual components and functions
- `tests/integration/` - Integration tests for API endpoints
- `tests/e2e/` - End-to-end tests with Cypress

## Development

```bash
# Install dependencies
npm install
cd back-end && npm install

# Start development servers
npm run dev  # Frontend
cd back-end && npm run dev  # Backend
```

---

