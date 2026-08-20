import type { CartItem } from "@/types";

export function getLineTotal(price: string, quantity: number) {
  return parseFloat(price) * quantity;
}

export function getCartTotal(items: CartItem[]) {
  return items.reduce((sum, item) => sum + getLineTotal(item.price, item.quantity), 0);
}
