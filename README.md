# Mini QR Ordering System

MVP QR-code food ordering. Customer scans QR at table → orders on phone. Restaurant staff view/update orders in admin panel.

Full spec: [prd.md](prd.md). Claude Code guidance: [CLAUDE.md](CLAUDE.md).

## Scope

In: browse products, cart, place order, admin order list/detail, status updates, QR code generation.

Out (MVP): payments, customer accounts, delivery, loyalty/discounts, inventory tracking, multi-branch, real-time notifications, kitchen display. See [prd.md](prd.md) §44 for future roadmap.

## Stack

```
Next.js + TypeScript + Tailwind + Axios + React Hooks
        ↓
NestJS + Swagger + Prisma
        ↓
MySQL
```

- **Frontend** — Next.js, TypeScript, Tailwind, shadcn/ui (Base UI primitives), Axios, plain `useState`/`useEffect` (no external state/query libs)
- **Backend** — NestJS, Prisma, Swagger, class-validator
- **DB** — MySQL
- **QR** — `qrcode` package

## Structure

```
cubetech/
├── frontend/     # Next.js — order/page.tsx, admin/orders/
├── backend/      # NestJS — products/, orders/, prisma/
├── prd.md        # full product spec
└── tasks/        # implementation task breakdown
```

## Setup

Requires MySQL running at `localhost:3306`.

```bash
# backend
cd backend
npm install
npx prisma migrate dev
npx prisma generate
npm run start:dev        # localhost:3001, Swagger at /api/docs

# frontend
cd frontend
npm install
npm run dev               # localhost:3000
```

### Env vars

**backend/.env**
```
DATABASE_URL="mysql://root:password@localhost:3306/mini_ordering_system"
PORT=3001
```

**frontend/.env.local**
```
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

## API

```
GET   /products              available products only
POST  /orders                create order (customerName, items[{productId, quantity}])
GET   /orders                list orders (admin)
GET   /orders/:id            order detail with items
PATCH /orders/:id/status     update order status
```

## Data model

`products`, `orders`, `order_items`. Order status: `PENDING → PREPARING → COMPLETED`, or `CANCELLED`.

Prices/product names are copied onto `order_items` at order time — historical orders stay correct even if a product's price changes later.

## Key rules

- Backend always recalculates totals from DB prices. Frontend total is display-only, never trusted.
- Only `is_available = true` products are ever returned or orderable.
- Admin routes require basic auth.
