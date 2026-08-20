# CubeTech Mini QR Ordering System Assessment

QR-code food ordering MVP. Customer scans QR at table → browses menu → orders on phone. Restaurant staff view/update orders in an admin panel.

Full spec: [prd.md](prd.md).

## Features

**Customer** (`/order`)

- Browse available products, grouped by category
- Add to cart, adjust quantity, remove items
- Enter name, submit order
- Order confirmation + status lookup

**Admin** (`/admin/orders`)

- List all orders (status, customer, item count, total)
- Order detail view (line items, quantities, prices at time of purchase)
- Update order status: `PENDING → PREPARING → COMPLETED`, or `CANCELLED`

**Landing page** (`/`) — generates the QR code that points at the order page, rendered inline in-browser.

## Tech Stack

```
Next.js + TypeScript + Tailwind + ShadCN + Axios + React Hooks
        ↓
NestJS + Swagger + Prisma ORM
        ↓
MySQL
```

- **Frontend** — Next.js 16, TypeScript, Tailwind, shadcn/ui (Base UI primitives), Axios, plain `useState`/`useEffect` (no external state/query libs)
- **Backend** — NestJS 11, Prisma 5, Swagger
- **DB** — MySQL 8

## Architecture

```
cubetech/
├── frontend/              # Next.js app
│   ├── app/               # Pages & routes
│   ├── components/        # UI components
│   ├── hooks/             # React hooks
│   ├── lib/               # API & utilities
│   ├── constants/         # App constants
│   ├── types/             # TypeScript types
│   └── scripts/           # QR generator
│
├── backend/               # NestJS API
│   ├── src/
│   │   ├── products/      # Product module
│   │   ├── orders/        # Order module
│   │   ├── prisma/        # Prisma service
│   │   └── main.ts        # App bootstrap
│   └── prisma/            # Schema, migrations & seed
│
├── design.json            # Design tokens
├── prd.md                 # Product requirements
└── CLAUDE.md              # Development guidelines
```

## Prerequisites

- **Node.js 20+** and npm
- **MySQL 8+** running locally (or reachable), with a database created for the app
- **Git**

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

Seed sample products (~50 menu items across Appetizers, Soups, Rice Meals, Chicken, Burgers, Pizza, Drinks, etc.):

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

Find your machine's LAN IP (needed so a phone can reach these pages — skip and use `localhost` if you're only testing on this machine):

```bash
# Windows
ipconfig
# macOS/Linux
ifconfig | grep inet
```

Look for an IPv4 address like `192.168.x.x` or `10.x.x.x`. **Replace `<YOUR_LAN_IP>` below with that value.**

Create `frontend/.env.local`:

```
# Testing only on web (NO QR Scanning):
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Phone on the same LAN needs to scan the QR — use your LAN IP instead:
NEXT_PUBLIC_API_URL="http://<YOUR_LAN_IP>:3001"
NEXT_PUBLIC_APP_URL="http://<YOUR_LAN_IP>:3000"
```

(Pick one pair, not both — comment/delete the other.)

Start the app (binds `0.0.0.0` so phones on the LAN can reach it):

```bash
npm run dev
```

Frontend runs at `http://localhost:3000` (or `http://<YOUR_LAN_IP>:3000` from another device).

- Customer order page: `/order`
- Admin orders: `/admin/orders`

### 5. Generate a QR code (for phone scanning)

Open the frontend in a browser using the same host you put in `NEXT_PUBLIC_APP_URL` (e.g. `http://<YOUR_LAN_IP>:3000` if set up for LAN), then click **Generate QR Code** on the landing page — it renders inline, pointing at `NEXT_PUBLIC_APP_URL/order`. Scan with your phone.

A CLI alternative also exists (writes `frontend/public/qr.png` instead of showing it on-page):

```bash
cd frontend
ORDER_URL="http://<YOUR_LAN_IP>:3000/order" npm run generate:qr
```

## API

Interactive docs (Swagger): `http://localhost:3001/api/docs`.

```
GET   /products              available products only
POST  /orders                create order (customerName, items[{productId, quantity}])
GET   /orders                list orders (admin)
GET   /orders/:id            order detail with items
PATCH /orders/:id/status     update order status
```
