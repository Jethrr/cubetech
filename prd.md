# Product Requirements Document (PRD)

# Mini QR Ordering System

**Version:** 1.0
**Project Type:** MVP
**Status:** Development Ready

---

# 1. Project Overview

The **Mini QR Ordering System** is a simple restaurant ordering application.

Customers scan a QR code using their phone. The QR code opens the restaurant's ordering page where customers can:

1. View available products
2. Add products to their cart
3. Change quantities
4. Remove products
5. Enter their name
6. Submit their order

Restaurant staff can use an **Admin Page** to view submitted orders and update their status.

The system is designed to be **simple, fast, mobile-friendly, and easy to set up**.

---

# 2. Main Goal

The main goal is to replace a simple manual ordering process with a small digital ordering system.

### Customer Flow

```text
Scan QR Code
     ↓
View Menu
     ↓
Add Products
     ↓
Review Cart
     ↓
Enter Name
     ↓
Place Order
     ↓
Order Confirmation
```

### Admin Flow

```text
Open Admin Page
     ↓
View Orders
     ↓
Open Order
     ↓
View Ordered Products
     ↓
Update Order Status
```

---

# 3. MVP Scope

The first version will only include the features necessary to make the ordering system work.

## Included

- QR code
- Product menu
- Shopping cart
- Quantity controls
- Order submission
- Customer name
- Order total
- Order database
- Admin order list
- Order details
- Order status
- Swagger API documentation

## Not Included

The following are intentionally excluded from the MVP:

- Online payments
- Customer accounts
- Customer registration
- Delivery
- Loyalty points
- Discounts
- Coupons
- Inventory tracking
- Advanced reports
- Multiple restaurants
- Multiple branches
- Real-time notifications
- Kitchen display system

These can be added in future versions if needed.

---

# 4. Technology Stack

The project should use a simple and modern stack.

## Frontend

- **Next.js**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** (Base UI primitives, installed via `npx shadcn@latest add`)
- **Axios**
- **React Hooks**

## Backend

- **NestJS**
- **TypeScript**
- **Prisma**
- **Swagger**
- **class-validator**

## Database

- **MySQL**

## QR Code

- **qrcode**

---

# 5. Why This Stack?

The project should avoid unnecessary complexity.

The architecture will be:

```text
Next.js
   ↓
Axios
   ↓
NestJS API
   ↓
Prisma
   ↓
MySQL
```

### Frontend

Next.js will handle the customer and admin interfaces.

### shadcn/ui

shadcn/ui provides accessible, pre-built components (buttons, inputs, cards, select, badge, etc.) copied into `frontend/components/ui/`, styled with Tailwind CSS on top of Base UI primitives. This avoids hand-rolling common UI patterns while keeping full control over the markup.

Visual direction (colors, spacing, radius, typography) follows [design.json](design.json) — "Warm Functional Minimalism": neutral grayscale chrome with a single warm orange accent (`#F07B22`) reserved for the primary action, applied via shadcn's CSS-variable theming in `frontend/app/globals.css`.

### Axios

Axios will handle API requests.

TanStack Query is **not required** for this MVP because the system only has a small number of API requests.

React Hooks such as:

```text
useState
useEffect
```

are enough for the frontend.

### NestJS

NestJS will handle:

- API endpoints
- Business logic
- Validation
- Orders
- Products

### Prisma

Prisma will handle communication between NestJS and MySQL.

### MySQL

MySQL will store:

- Products
- Orders
- Order items

---

# 6. System Architecture

```text
                    CUSTOMER
                       │
                       │ Scan QR
                       ▼
                ┌─────────────┐
                │   Next.js   │
                │  Customer   │
                │    Page     │
                └──────┬──────┘
                       │
                     Axios
                       │
                       ▼
                ┌─────────────┐
                │   NestJS    │
                │     API     │
                └──────┬──────┘
                       │
                    Prisma
                       │
                       ▼
                ┌─────────────┐
                │    MySQL    │
                └─────────────┘
                       ▲
                       │
                  ┌────┴────┐
                  │  Admin  │
                  │  Page   │
                  └─────────┘
```

---

# 7. User Types

There are two types of users.

## 7.1 Customer

Customers use the ordering page.

They do not need an account.

They can:

- View products
- Add products
- Manage cart
- Submit an order

## 7.2 Admin

The admin is restaurant staff.

The admin can:

- View orders
- View order details
- Update order status

---

# 8. Customer Page

The customer page is the main page accessed through the QR code.

Example URL:

```text
https://yourdomain.com/order
```

The page should be designed primarily for mobile phones.

---

# 9. Product Menu

The customer should see a list of available products.

Each product should show:

- Product name
- Price
- Add button

Example:

```text
┌─────────────────────────┐
│ Chicken Burger          │
│ ₱120                    │
│                    [+]  │
└─────────────────────────┘

┌─────────────────────────┐
│ French Fries            │
│ ₱60                     │
│                    [+]  │
└─────────────────────────┘
```

## Requirements

- Products must come from the backend API.
- Only available products should be displayed.
- Products should have clear prices.
- Customer can add a product to the cart.

---

# 10. Shopping Cart

The customer can open their cart to review their order.

The cart should display:

- Product name
- Price
- Quantity
- Subtotal
- Total amount

Example:

```text
Your Cart

Chicken Burger
₱120 × 2
₱240

French Fries
₱60 × 1
₱60

-------------------

Total
₱300

[ Proceed to Order ]
```

---

# 11. Cart Functions

The customer must be able to:

### Add Product

Example:

```text
Chicken Burger
[ Add ]
```

After clicking:

```text
Chicken Burger
[-] 1 [+]
```

### Increase Quantity

```text
[-] 1 [+]
       ↓
[-] 2 [+]
```

### Decrease Quantity

```text
[-] 2 [+]
       ↓
[-] 1 [+]
```

### Remove Product

The customer can completely remove a product from the cart.

### Calculate Total

The frontend should display:

```text
Subtotal = Price × Quantity
```

and:

```text
Total = Sum of all item subtotals
```

However, the **backend must calculate the final total again** when the order is submitted.

---

# 12. Customer Information

Before placing an order, the customer must enter their name.

Example:

```text
Customer Name

[ Juan Dela Cruz ]

[ Place Order ]
```

## Requirements

- Customer name is required.
- Minimum length: 2 characters.
- Maximum length: 255 characters.

No customer account is required.

---

# 13. Place Order

When the customer clicks:

```text
Place Order
```

the frontend sends the order to:

```text
POST /orders
```

Example request:

```json
{
  "customerName": "Juan Dela Cruz",
  "items": [
    {
      "productId": 1,
      "quantity": 2
    },
    {
      "productId": 2,
      "quantity": 1
    }
  ]
}
```

---

# 14. Backend Order Processing

When NestJS receives an order, it must:

1. Validate the request.
2. Check that each product exists.
3. Check that each product is available.
4. Get the current product price from MySQL.
5. Calculate each item's subtotal.
6. Calculate the total order amount.
7. Create the order.
8. Create the order items.
9. Return the created order.

### Important

The backend must **never trust the total amount sent by the frontend**.

For example, the customer should not be able to modify:

```text
Chicken Burger = ₱120
```

into:

```text
Chicken Burger = ₱1
```

The backend retrieves the actual price from the database.

---

# 15. Order Confirmation

After a successful order, the customer sees a confirmation page.

Example:

```text
┌─────────────────────────┐
│                         │
│     Order Submitted!    │
│                         │
│   Thank you, Juan!      │
│                         │
│      Order #1024        │
│                         │
│       Total: ₱300       │
│                         │
│ Your order is being     │
│ prepared.               │
│                         │
└─────────────────────────┘
```

The cart should be cleared after the order is successfully created.

---

# 16. QR Code

The restaurant will have a QR code that opens the ordering page.

Example:

```text
QR Code
   ↓
https://yourdomain.com/order
```

The QR code can be placed on:

- Tables
- Counter
- Printed menus
- Posters

The MVP does not require a complicated QR management system.

A single QR code is sufficient.

---

# 17. Admin Page

The admin page allows restaurant staff to view orders.

Example URL:

```text
/admin/orders
```

The admin page should display:

- Order ID
- Customer name
- Total amount
- Order date
- Status

Example:

```text
Orders

#1024
Juan Dela Cruz
₱300
Pending

#1023
Maria Santos
₱180
Completed

#1022
Pedro Cruz
₱420
Preparing
```

---

# 18. Admin Order Details

Clicking an order opens the order details.

Example:

```text
Order #1024

Customer:
Juan Dela Cruz

Items:

Chicken Burger
₱120 × 2 = ₱240

French Fries
₱60 × 1 = ₱60

-------------------

Total:
₱300

Status:
Pending
```

---

# 19. Order Status

Orders will have a simple status.

Available statuses:

```text
PENDING
PREPARING
COMPLETED
CANCELLED
```

New orders automatically start as:

```text
PENDING
```

The admin can change the status.

Example:

```text
PENDING
   ↓
PREPARING
   ↓
COMPLETED
```

An order may also be changed to:

```text
CANCELLED
```

---

# 20. Database

The MVP requires three tables.

```text
Products
Orders
Order Items
```

---

# 21. Products Table

Table name:

```text
products
```

Fields:

| Field        | Type          | Description                    |
| ------------ | ------------- | ------------------------------ |
| id           | INT           | Primary key                    |
| name         | VARCHAR(255)  | Product name                   |
| price        | DECIMAL(10,2) | Product price                  |
| is_available | BOOLEAN       | Whether product can be ordered |
| created_at   | DATETIME      | Creation date                  |
| updated_at   | DATETIME      | Last update                    |

Example:

```text
1 | Chicken Burger | 120.00 | true
2 | French Fries   | 60.00  | true
3 | Coke           | 40.00  | false
```

---

# 22. Orders Table

Table name:

```text
orders
```

Fields:

| Field         | Type          | Description        |
| ------------- | ------------- | ------------------ |
| id            | INT           | Primary key        |
| customer_name | VARCHAR(255)  | Customer name      |
| total_amount  | DECIMAL(10,2) | Total order amount |
| status        | ENUM          | Order status       |
| created_at    | DATETIME      | Order date         |
| updated_at    | DATETIME      | Last update        |

---

# 23. Order Items Table

Table name:

```text
order_items
```

Fields:

| Field        | Type          | Description               |
| ------------ | ------------- | ------------------------- |
| id           | INT           | Primary key               |
| order_id     | INT           | Related order             |
| product_id   | INT           | Related product           |
| product_name | VARCHAR(255)  | Product name at purchase  |
| price        | DECIMAL(10,2) | Product price at purchase |
| quantity     | INT           | Quantity ordered          |
| subtotal     | DECIMAL(10,2) | Price × quantity          |

---

# 24. Database Relationship

```text
PRODUCT
   │
   │
   │ can appear in many
   ▼
ORDER ITEM
   │
   │ belongs to
   ▼
ORDER
```

An order can contain multiple order items.

Example:

```text
Order #1024

├── Chicken Burger × 2
├── French Fries × 1
└── Coke × 2
```

---

# 25. Why Store Product Name and Price in Order Items?

Suppose a customer orders:

```text
Chicken Burger
₱120
```

Later, the restaurant changes the price:

```text
Chicken Burger
₱150
```

The old order should still show:

```text
Chicken Burger
₱120
```

Therefore, `product_name` and `price` are saved inside `order_items` when the order is created.

---

# 26. API Endpoints

The backend will provide a simple REST API.

## Route Reference (Quick Summary)

### Frontend Pages (Next.js)

| Method | Route                | Description                  |
| ------ | --------------------- | ----------------------------- |
| GET    | `/order`               | Customer ordering page (menu, cart, checkout) |
| GET    | `/admin/orders`        | Admin order list              |
| GET    | `/admin/orders/:id`    | Admin order detail + status update |

### Backend API (NestJS)

| Method | Endpoint              | Description                  |
| ------ | --------------------- | ----------------------------- |
| GET    | `/products`            | List available products       |
| POST   | `/orders`               | Create a new order            |
| GET    | `/orders`               | List all orders (admin)       |
| GET    | `/orders/:id`           | Get one order with its items  |
| PATCH  | `/orders/:id/status`    | Update order status           |
| GET    | `/api/docs`             | Swagger API documentation     |

---

## Products

### GET `/products`

Returns available products.

Example response:

```json
[
  {
    "id": 1,
    "name": "Chicken Burger",
    "price": 120
  },
  {
    "id": 2,
    "name": "French Fries",
    "price": 60
  }
]
```

---

## Orders

### POST `/orders`

Creates a new order.

Request:

```json
{
  "customerName": "Juan Dela Cruz",
  "items": [
    {
      "productId": 1,
      "quantity": 2
    }
  ]
}
```

---

### GET `/orders`

Returns all orders.

Used by the admin page.

---

### GET `/orders/:id`

Returns one order with its items.

---

### PATCH `/orders/:id/status`

Updates the order status.

Request:

```json
{
  "status": "COMPLETED"
}
```

---

# 27. Swagger

Swagger will document the NestJS API.

Swagger URL:

```text
/api/docs
```

Swagger should show:

```text
Products

GET /products


Orders

GET   /orders
GET   /orders/:id
POST  /orders
PATCH /orders/:id/status
```

Swagger is mainly for developers and API testing.

---

# 28. Frontend Structure

Keep the Next.js project simple.

```text
frontend/
│
├── app/
│   ├── order/
│   │   └── page.tsx
│   │
│   ├── admin/
│   │   └── orders/
│   │       ├── page.tsx
│   │       └── [id]/
│   │           └── page.tsx
│   │
│   └── page.tsx
│
├── components/
│   ├── ProductCard.tsx
│   ├── Cart.tsx
│   ├── CartItem.tsx
│   ├── OrderForm.tsx
│   └── OrderStatus.tsx
│
├── lib/
│   └── api.ts
│
└── types/
    └── index.ts
```

---

# 29. Backend Structure

Keep NestJS modular but simple.

```text
backend/
│
├── src/
│   │
│   ├── products/
│   │   ├── products.controller.ts
│   │   ├── products.service.ts
│   │   └── products.module.ts
│   │
│   ├── orders/
│   │   ├── orders.controller.ts
│   │   ├── orders.service.ts
│   │   └── orders.module.ts
│   │
│   ├── prisma/
│   │   ├── prisma.service.ts
│   │   └── prisma.module.ts
│   │
│   ├── app.module.ts
│   └── main.ts
│
└── prisma/
    └── schema.prisma
```

---

# 30. API Client

Create one Axios instance.

Example:

```text
frontend/lib/api.ts
```

It will contain the backend URL.

Example:

```typescript
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});
```

Frontend components should use this API client instead of creating Axios instances repeatedly.

---

# 31. React State Management

No external state management library is required.

Use:

```text
useState
useEffect
```

### Product State

```text
products
```

### Cart State

```text
cart
```

### Customer State

```text
customerName
```

### Loading State

```text
loading
```

### Error State

```text
error
```

For this MVP, React's built-in state management is enough.

---

# 32. Cart Data Structure

The cart can use a simple structure:

```typescript
{
  productId: 1,
  name: "Chicken Burger",
  price: 120,
  quantity: 2
}
```

Example:

```text
cart = [
  {
    productId: 1,
    name: "Chicken Burger",
    price: 120,
    quantity: 2
  },
  {
    productId: 2,
    name: "French Fries",
    price: 60,
    quantity: 1
  }
]
```

---

# 33. Mobile Design

The customer page must be **mobile-first** because customers will primarily access it through their phones.

The interface should have:

- Large buttons
- Easy-to-read prices
- Simple product cards
- Easy quantity controls
- Fixed/sticky cart button
- Minimal navigation
- Clear checkout button

Example:

```text
┌───────────────────────┐
│      Restaurant       │
│                       │
│ Menu                  │
│                       │
│ Chicken Burger        │
│ ₱120          [Add]   │
│                       │
│ French Fries          │
│ ₱60           [Add]   │
│                       │
│                       │
│ ───────────────────── │
│ Cart · 3 items        │
│ ₱300          [Cart]   │
└───────────────────────┘
```

---

# 34. Error Handling

The application should show simple error messages.

Examples:

### Products fail to load

```text
Unable to load menu.
Please try again.
```

### Order submission fails

```text
Unable to place your order.
Please try again.
```

### Product unavailable

```text
Some items in your cart are no longer available.
Please review your order.
```

---

# 35. Validation

The backend must validate all incoming requests.

## Customer Name

```text
Required
Minimum: 2 characters
Maximum: 255 characters
```

## Product ID

```text
Required
Must be a valid integer
```

## Quantity

```text
Required
Must be an integer
Minimum: 1
```

---

# 36. Security

The MVP should implement basic security practices.

### Backend Validation

All incoming data must be validated.

### Price Protection

The backend calculates prices using the database.

### Database Protection

Prisma will be used for database queries.

### CORS

Configure NestJS CORS to allow requests from the frontend.

### Admin Access

For the MVP, the admin page should have basic authentication.

The authentication system should remain simple.

No complex role/permission system is required.

---

# 37. Performance

The system is small, so performance requirements should remain simple.

The application should:

- Load the menu quickly.
- Avoid unnecessary API requests.
- Use optimized images if products have images.
- Keep the customer page lightweight.
- Work properly on mobile internet connections.

---

# 38. Setup Requirements

The project should be easy for another developer to run locally.

Required software:

```text
Node.js
MySQL
Git
```

No Docker is required for the MVP.

---

# 39. Local Development

The project will have two applications:

```text
frontend
backend
```

Run the backend:

```bash
cd backend
npm install
npm run start:dev
```

Run the frontend:

```bash
cd frontend
npm install
npm run dev
```

MySQL runs locally.

Example:

```text
MySQL
localhost:3306

NestJS
localhost:3001

Next.js
localhost:3000
```

---

# 40. Environment Variables

## Backend

```env
DATABASE_URL="mysql://root:password@localhost:3306/mini_qr_ordering"
PORT=3001
```

## Frontend

```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

---

# 41. Prisma Setup

The database structure will be defined in:

```text
backend/prisma/schema.prisma
```

After creating the schema:

```bash
npx prisma migrate dev
```

Then Prisma Client:

```bash
npx prisma generate
```

---

# 42. Seed Data

The project should include simple sample products so the application can be tested immediately.

Example:

```text
Chicken Burger    ₱120
French Fries       ₱60
Coke               ₱40
Spaghetti         ₱100
Chicken Meal      ₱150
```

A Prisma seed script can automatically insert these products.

---

# 43. Definition of Done

The MVP is complete when all of the following work.

## Customer

- [ ] QR code opens the ordering page.
- [ ] Customer can see products.
- [ ] Customer can add products.
- [ ] Customer can increase quantity.
- [ ] Customer can decrease quantity.
- [ ] Customer can remove products.
- [ ] Customer can see cart total.
- [ ] Customer can enter their name.
- [ ] Customer can submit an order.
- [ ] Backend validates the order.
- [ ] Backend calculates the correct total.
- [ ] Order is saved to MySQL.
- [ ] Customer sees an order confirmation.
- [ ] Cart is cleared after successful order.
- [ ] Page works on mobile.

## Admin

- [x] Admin can access the admin page.
- [x] Admin can see submitted orders.
- [x] Admin can open an order.
- [x] Admin can see ordered products.
- [x] Admin can see the total.
- [x] Admin can update order status.

## Backend

- [ ] NestJS API works.
- [ ] Products API works.
- [ ] Orders API works.
- [ ] Order Items are saved correctly.
- [ ] Request validation works.
- [ ] Backend calculates order totals.
- [ ] Swagger documentation works.
- [ ] MySQL connection works.

---

# 44. Future Features

Only consider these after the MVP is working.

### Product Management

- Add product
- Edit product
- Delete product
- Upload product image
- Product categories

### Orders

- Real-time order updates
- Kitchen display
- Order notifications
- Order history
- Search orders

### Payments

- GCash
- Maya
- Credit/debit card

### QR Improvements

- Different QR code per table
- Table number automatically included in order
- Multiple restaurant branches

### Analytics

- Daily sales
- Most ordered products
- Revenue reports
- Number of orders

---

# 45. Final Project Structure

```text
mini-qr-ordering/
│
├── frontend/                  # Next.js
│   ├── app/
│   │   ├── order/
│   │   │   └── page.tsx
│   │   │
│   │   └── admin/
│   │       └── orders/
│   │           ├── page.tsx
│   │           └── [id]/
│   │               └── page.tsx
│   │
│   ├── components/
│   │   ├── ProductCard.tsx
│   │   ├── Cart.tsx
│   │   ├── CartItem.tsx
│   │   └── OrderForm.tsx
│   │
│   ├── lib/
│   │   └── api.ts
│   │
│   └── types/
│       └── index.ts
│
├── backend/                   # NestJS
│   ├── src/
│   │   ├── products/
│   │   ├── orders/
│   │   ├── prisma/
│   │   ├── app.module.ts
│   │   └── main.ts
│   │
│   └── prisma/
│       └── schema.prisma
│
└── README.md
```

---

# 46. Final Architecture

The entire application should follow this simple flow:

```text
                         CUSTOMER
                            │
                         Scan QR
                            │
                            ▼
                    ┌──────────────┐
                    │   Next.js    │
                    │              │
                    │ Menu         │
                    │ Cart         │
                    │ Checkout     │
                    └──────┬───────┘
                           │
                         Axios
                           │
                           ▼
                    ┌──────────────┐
                    │    NestJS    │
                    │              │
                    │ Products     │
                    │ Orders       │
                    │ Validation   │
                    └──────┬───────┘
                           │
                         Prisma
                           │
                           ▼
                    ┌──────────────┐
                    │    MySQL     │
                    │              │
                    │ Products     │
                    │ Orders       │
                    │ Order Items  │
                    └──────────────┘
                           ▲
                           │
                    ┌──────┴───────┐
                    │    Admin     │
                    │              │
                    │ View Orders  │
                    │ Order Detail │
                    │ Update Status│
                    └──────────────┘
```

# 47. Core Principle

The Mini QR Ordering System should follow one rule:

> **Keep the MVP simple. Build only what is necessary to let a customer scan a QR code, order food, and let the restaurant see the order.**

Avoid adding libraries, services, authentication systems, infrastructure, or features unless they are actually required.

**Final stack:**

```text
Next.js
+ TypeScript
+ Tailwind CSS
+ shadcn/ui
+ Axios
+ React Hooks
        ↓
NestJS
+ Swagger
+ Prisma
        ↓
MySQL
```
