# SaaS Admin Dashboard — Full Stack Demo

A complete, working SaaS admin dashboard built to showcase full-stack development
skills: authentication with roles, CRUD data management, real-time-style analytics
charts, dark/light mode, and a subscription billing flow.

![Stack](https://img.shields.io/badge/stack-React%20%2B%20Node.js-blue)

## ✨ Features

- **Authentication & Roles** — JWT-based login with `admin` and `user` roles.
  Admins can manage customers; regular users have read-only access.
- **Live Analytics Dashboard** — KPI cards (total customers, MRR, active
  subscriptions, churn rate) plus a revenue trend line chart and a
  customers-by-plan pie chart, built with Recharts.
- **Customer CRUD** — Searchable, paginated data table with add / edit / delete
  (admin-only), backed by a REST API.
- **Dark / Light Mode** — Persisted to `localStorage`, toggled from the navbar.
- **Subscription Billing** — Plan selection UI with a mocked Stripe Checkout
  flow, ready to swap in real Stripe keys.
- **Clean Architecture** — Separate frontend/backend, reusable components,
  context-based state management, and a data layer designed to be swapped
  for PostgreSQL with minimal changes.

## 🧱 Tech Stack

| Layer      | Technology                                      |
|------------|--------------------------------------------------|
| Frontend   | React 18, Vite, React Router, Tailwind CSS, Recharts, Axios |
| Backend    | Node.js, Express, JWT, bcryptjs                 |
| Data       | JSON file storage (demo) → swap for PostgreSQL for production |
| Payments   | Mocked Stripe Checkout flow (swap for real Stripe SDK) |

## 📁 Project Structure

```
saas-dashboard/
├── backend/
│   ├── routes/          # auth, customers, analytics, billing
│   ├── middleware/      # JWT auth + role guard
│   ├── data/db.json     # demo data store (auto-created)
│   ├── seed.js          # populates demo users & customers
│   └── server.js
└── frontend/
    └── src/
        ├── context/      # Auth + Theme context providers
        ├── components/   # Sidebar, Navbar, KpiCard, ProtectedRoute
        └── pages/         # Login, Dashboard, Customers, Billing
```

## 🚀 Getting Started

### 1. Backend

```bash
cd backend
cp .env.example .env
npm install
npm run seed     # creates demo users + 18 sample customers
npm run dev      # starts API on http://localhost:4000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev      # starts app on http://localhost:5173
```

### 3. Log in with demo credentials

| Role  | Email             | Password   |
|-------|--------------------|-----------|
| Admin | admin@demo.com     | admin123  |
| User  | user@demo.com      | user123   |

The admin account can add/edit/delete customers; the user account has
read-only access — a great way to demonstrate role-based access control
to clients.

## 🔌 API Overview

| Method | Endpoint                          | Auth        | Description                     |
|--------|------------------------------------|-------------|----------------------------------|
| POST   | `/api/auth/register`               | Public      | Create a new account            |
| POST   | `/api/auth/login`                  | Public      | Log in, returns JWT              |
| GET    | `/api/auth/me`                     | Required    | Get current user                |
| GET    | `/api/customers`                   | Required    | List customers (search + pagination) |
| POST   | `/api/customers`                   | Admin only  | Create a customer                |
| PUT    | `/api/customers/:id`                | Admin only  | Update a customer                |
| DELETE | `/api/customers/:id`                | Admin only  | Delete a customer                |
| GET    | `/api/analytics/overview`           | Required    | KPI + chart data                 |
| POST   | `/api/billing/create-checkout-session` | Required | Mock Stripe checkout            |

## 🗄️ Moving to PostgreSQL

The demo uses a simple JSON file (`backend/data/db.json`) so it runs instantly
with zero setup. Every function in `db.js` maps directly to a SQL operation,
so swapping in PostgreSQL means:

1. `npm install pg` (or an ORM like Prisma/Sequelize/Drizzle)
2. Replace `readDB()` / `writeDB()` calls in each route with SQL queries,
   e.g. `SELECT * FROM customers WHERE ...`
3. Add `DATABASE_URL` to `.env` and connect on server start

Suggested schema:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT NOT NULL,
  plan TEXT NOT NULL,
  status TEXT NOT NULL,
  mrr NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

## 💳 Going Live with Stripe

`backend/routes/billing.js` includes commented-out real Stripe code. To activate:

1. `npm install stripe`
2. Add `STRIPE_SECRET_KEY` to `.env`
3. Replace the mock response in `create-checkout-session` with a real
   `stripe.checkout.sessions.create(...)` call
4. Add a webhook handler to update customer subscription status on payment events

## 📸 Showing This to Clients

- Deploy the frontend to **Vercel/Netlify** and the backend to **Render/Railway**
  so you have a live link, not just code.
- Walk through: login as admin → show dashboard charts → add a customer live →
  toggle dark mode → show the billing plans page.
- Mention the PostgreSQL/Stripe upgrade path above — it shows you understand
  how to take a demo to production, which is exactly what clients want to hear.

## 📄 License

Free to use and modify for your own portfolio or client projects.
