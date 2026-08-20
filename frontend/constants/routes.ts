export const APP_ROUTES = {
  order: "/order",
  adminOrders: "/admin/orders",
} as const;

export const API_ENDPOINTS = {
  products: "/products",
  orders: "/orders",
  order: (id: number | string) => `/orders/${id}`,
  orderStatus: (id: number | string) => `/orders/${id}/status`,
} as const;
