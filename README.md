# 🍕 Ye Pizza — Pizza Delivery Web App

A modern React + TypeScript application with a full e‑commerce flow: product catalog, advanced filtering, shopping cart, and checkout. The project is split into a Vite + React frontend and an Express + PostgreSQL backend, with Stripe Checkout and email notifications via Resend.

---

## Features

- Category‑based catalog (pizzas, snacks, drinks, desserts)
- Filtering: ingredients, price range, sizes/types, sorting
- Smooth cart updates with stable layout (no content jumps during async work)
- Order placement with redirect to Stripe Checkout
- Email notifications (Resend), consistent skeletons/spinners for loading
- Responsive UI and polished interactions

---

## Tech stack (with links)

- Frontend: [React 18](https://react.dev), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vite.dev), [React Router](https://reactrouter.com/), [Zustand](https://github.com/pmndrs/zustand), [React Hook Form](https://react-hook-form.com/), [PrimeReact](https://primereact.org), [Lucide Icons](https://lucide.dev)
- Backend: [Node.js](https://nodejs.org/), [Express](https://expressjs.com/), [PostgreSQL](https://www.postgresql.org/), [Stripe](https://stripe.com/docs), [Resend](https://resend.com)
- Styling: [CSS](https://developer.mozilla.org/docs/Web/CSS)
- Dev tools: [ESLint](https://eslint.org), [TypeScript](https://www.typescriptlang.org/), [nodemon](https://nodemon.io), [ts-node](https://typestrong.org/ts-node/)

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

## TODO 
1. отправка емайла при успешной регистрации
2. посмотреть что можно улучшить или добавить

