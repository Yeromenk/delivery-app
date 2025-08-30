# 🍕 Pizza Delivery Web Application

A modern, responsive pizza delivery web application built with **React** and **TypeScript**.  
The app provides a complete e-commerce experience with product catalog, advanced filtering, shopping cart, and checkout.

---

## 🚀 Features

- **Product Catalog**: Browse pizzas organized by categories
- **Advanced Filtering**: Filter by ingredients, price range, and other criteria
- **Shopping Cart**: Add/remove items with real-time cart updates
- **Checkout Process**: Full order flow with payment integration
- **Responsive Design**: Optimized for desktop and mobile
- **Loading States**: Skeleton loaders for better UX during data fetching
- **Modal System**: Product details and selection modals
- **URL State Management**: Shareable URLs with filter states

---

## 🛠️ Tech Stack

### Frontend
- **React 18** — hooks & functional components
- **TypeScript** — type-safe development
- **Vite** — blazing fast dev server & bundler
- **React Router DOM** — client-side routing
- **Zustand** — lightweight state management
- **React Hook Form** — forms & validation
- **PrimeReact** — UI components (incl. Skeleton)
- **Lucide React** — icon library

### Styling
- **CSS Modules** — scoped styles
- **Custom CSS** — responsive layouts & animations

### Dev Tools
- **ESLint** — linting
- **TypeScript** — type checking
- **Vite HMR** — hot module replacement

### Additional
- **react-use** — utility hooks (e.g., intersection observer)
- **Custom Hooks** — product fetching, query filters, cart management

---

## 📁 Project Structure

```bash
src/
├─ components/               # Reusable UI components
│  ├─ header/                # Navigation header
│  ├─ categories/            # Category navigation
│  ├─ filters/               # Product filters
│  ├─ product-card/          # Product display cards
│  ├─ product-group-list/    # Grouped product listings
│  ├─ checkout-sidebar/      # Checkout summary
│  └─ ui/                    # Generic UI primitives (buttons, inputs, modal)
│
├─ pages/
│  ├─ main/                  # Home page
│  └─ checkout/              # Checkout page
│
├─ hooks/
│  ├─ use-products.ts        # Product data fetching
│  ├─ use-cart.ts            # Cart management
│  ├─ use-query-filters.ts   # URL/query filters sync
│  └─ use-intersection.ts    # Active category highlighting
│
├─ store/                    # Zustand stores (cart, categories, filters)
├─ lib/                      # Utils (api client, formatters, constants)
├─ styles/                   # Global styles
├─ assets/                   # Images, icons
├─ typings/                  # Shared TS types & interfaces
└─ main.tsx                  # App bootstrap
