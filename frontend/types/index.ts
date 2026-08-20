export type OrderStatus = "PENDING" | "PREPARING" | "COMPLETED" | "CANCELLED";

export interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  imageUrl?: string | null;
  isAvailable?: boolean;
}

export interface CartItem {
  productId: number;
  name: string;
  price: string;
  quantity: number;
  imageUrl?: string | null;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  productName: string;
  price: string;
  quantity: number;
  subtotal: string;
}

export interface Order {
  id: number;
  customerName: string;
  totalAmount: string;
  status: OrderStatus;
  createdAt: string;
  itemCount?: number;
  items?: OrderItem[];
}
