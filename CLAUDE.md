# CLAUDE.md

Guidance for Claude Code working in this repo. Full spec: [prd.md](prd.md).

## Project

Mini QR Ordering System. Customer scans QR → orders food on phone. Admin views/updates orders. MVP, dev-ready, not yet scaffolded (repo currently only has prd.md).

## Core principle

Keep MVP simple. Build only what's needed: customer scans QR, orders food, restaurant sees order. No extra libs/services/auth/infra beyond what's specified. Don't add payments, accounts, delivery, loyalty, discounts, inventory tracking, multi-branch, real-time notifications, kitchen display — these are explicitly out of scope (see prd.md §3, §44).

## Stack

```
Next.js + TypeScript + Tailwind + Axios + React Hooks
        ↓
NestJS + Swagger + Prisma
        ↓
MySQL
```

- Frontend: Next.js, TypeScript, Tailwind CSS, shadcn/ui (Base UI primitives), Axios, React Hooks (`useState`/`useEffect` only — no TanStack Query, no external state mgmt)
- Backend: NestJS, TypeScript, Prisma, Swagger, class-validator
- DB: MySQL
- QR: `qrcode` package
- No Docker required for MVP

## UI components (shadcn/ui)

`frontend/components.json` config: style `base-nova`, base library `base` (Base UI, not Radix), base color `neutral`, icons `lucide`.

- Add components: `cd frontend && npx shadcn@latest add <component>`
- Installed so far: `button`, `input`, `card`, `badge`, `label`, `select` — add more only as screens need them.
- Design tokens live in `frontend/app/globals.css` (`:root` CSS vars) and are sourced from [design.json](design.json) — the single source of truth for color/spacing/radius/typography. Re-check it before hand-rolling any new UI pattern.
- Don't hardcode hex colors in components — use the Tailwind tokens (`bg-primary`, `text-muted-foreground`, `border-border`, etc.) so light/dark and future palette tweaks stay centralized.

## Structure

```
mini-qr-ordering/
├── frontend/               # Next.js
│   ├── app/
│   │   ├── order/page.tsx
│   │   └── admin/orders/page.tsx, [id]/page.tsx
│   ├── components/         # ProductCard, Cart, CartItem, OrderForm, OrderStatus
│   ├── lib/api.ts          # single Axios instance, baseURL = NEXT_PUBLIC_API_URL
│   └── types/index.ts
├── backend/                # NestJS
│   ├── src/products/, orders/, prisma/, app.module.ts, main.ts
│   └── prisma/schema.prisma
```

## Commands

```bash
# backend
cd backend && npm install && npm run start:dev   # localhost:3001
npx prisma migrate dev
npx prisma generate

# frontend
cd frontend && npm install && npm run dev        # localhost:3000
```

MySQL: `localhost:3306`. Swagger docs at `/api/docs`.

## Env vars

Backend: `DATABASE_URL="mysql://root:password@localhost:3306/mini_ordering_system"`, `PORT=3001`
Frontend: `NEXT_PUBLIC_API_URL="http://localhost:3001"`

## Data model

Three tables: `products`, `orders`, `order_items`.

- `order_items` stores `product_name` and `price` **at time of purchase** (not just `product_id`) — so historical orders stay correct if product price changes later. Always copy these fields when creating an order item.
- Order `status` enum: `PENDING → PREPARING → COMPLETED`, or `CANCELLED`. New orders always start `PENDING`.

## API

```
GET   /products           available products only
POST  /orders              create order (customerName, items[{productId, quantity}])
GET   /orders               list (admin)
GET   /orders/:id           detail with items
PATCH /orders/:id/status    update status
```

## Critical rules

- **Never trust totals/prices from the frontend.** Backend always recalculates price × quantity from the DB on order submission. Frontend total is display-only.
- Backend validates all incoming requests (class-validator): customerName required, 2–255 chars; productId required integer; quantity required integer ≥ 1.
- Only `is_available = true` products are ever returned/orderable.
- Admin page needs basic auth — keep it simple, no role/permission system.
- Configure NestJS CORS for the frontend origin.
- Customer page is mobile-first: large buttons, sticky cart button, minimal nav.

## Out of scope (don't build unless asked)

Payments, customer accounts, delivery, loyalty/discounts/coupons, inventory tracking, advanced reports, multi-restaurant/branch, real-time notifications, kitchen display, per-table QR codes. See prd.md §44 for future-feature list if these come up later.
