# CubeTech Mini QR Ordering System Assessment

QR-code food ordering. Customer scans QR at table → orders on phone. Restaurant staff view/update orders in admin panel.

Full spec: [prd.md](prd.md).
Claude Code: [CLAUDE.md](CLAUDE.md).

## Scope

In: browse products, cart, place order, admin order list/detail, status updates, QR code generation.

## Stack

```
Next.js + TypeScript + Tailwind + Axios + React Hooks
        ↓
NestJS + Swagger + Prisma
        ↓
MySQL
```

- **Frontend** — Next.js 16, TypeScript, Tailwind, shadcn/ui (Base UI primitives), Axios, plain `useState`/`useEffect` (no external state/query libs)
- **Backend** — NestJS 11, Prisma, Swagger, class-validator
- **DB** — MySQL
- **QR** — `qrcode` package

## Structure

```
cubetech/
├── frontend/     # Next.js — app/order/, app/admin/orders/
├── backend/      # NestJS — src/products/, src/orders/, prisma/
├── prd.md        # full product spec
```

## Prerequisites

- **Node.js 20+** and npm
- **MySQL 8+** running locally (or reachable), with a database created for the app
- Git

Check versions:

```bash
node -v
npm -v
mysql --version
```

## Setup from scratch

### 1. Clone and enter repo

```bash
git clone <repo-url> cubetech
cd cubetech
```

### 2. Create the database

```bash
mysql -u root -p -e "CREATE DATABASE mini_ordering_system;"
```

### 3. Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```
DATABASE_URL="mysql://<user>:<password>@localhost:3306/mini_ordering_system"
PORT=3001
```

Run migrations (creates tables) and generate the Prisma client:

```bash
npx prisma migrate dev
npx prisma generate
```

Seed sample products:

```bash
npx prisma db seed
```

Start the API:

```bash
npm run start:dev
```

Backend runs at `http://localhost:3001`. Swagger docs at `http://localhost:3001/api/docs`.

### 4. Frontend

Open a second terminal:

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:

```
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

Start the app:

```bash
npm run dev
```

Frontend runs at `http://localhost:3000`.

- Customer order page: `http://localhost:3000/order`
- Admin orders: `http://localhost:3000/admin/orders`

### 5. (Optional) Generate a QR code

Points at the customer order page (`ORDER_URL`, defaults to `http://localhost:3000/order`), writes `frontend/public/qr.png`:

```bash
cd frontend
npm run generate:qr
```

For a phone on the same LAN to actually load the pages, point both `ORDER_URL` and `NEXT_PUBLIC_API_URL` at your machine's LAN IP instead of `localhost`, e.g.:

```bash
ORDER_URL="http://192.168.1.8:3000/order" npm run generate:qr
```

## Everyday run (after first-time setup)

```bash
# terminal 1
cd backend && npm run start:dev

# terminal 2
cd frontend && npm run dev
```

MySQL must already be running.

## Env vars reference

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

Interactive docs (Swagger): `http://localhost:3001/api/docs`.

## Data model

`products`, `orders`, `order_items`. Order status: `PENDING → PREPARING → COMPLETED`, or `CANCELLED`.

Prices/product names are copied onto `order_items` at order time — historical orders stay correct even if a product's price changes later.
