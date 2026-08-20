import { useState } from "react";

import { getCartTotal } from "@/lib/cart";
import type { CartItem, Product } from "@/types";

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  function addItem(product: Product) {
    setItems((prev) => [
      ...prev,
      {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        imageUrl: product.imageUrl,
      },
    ]);
  }

  function incrementItem(productId: number) {
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    );
  }

  function decrementItem(productId: number) {
    setItems((prev) =>
      prev.flatMap((item) => {
        if (item.productId !== productId) return [item];
        if (item.quantity <= 1) return [];
        return [{ ...item, quantity: item.quantity - 1 }];
      }),
    );
  }

  function removeItem(productId: number) {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  }

  function clear() {
    setItems([]);
  }

  return {
    items,
    addItem,
    incrementItem,
    decrementItem,
    removeItem,
    clear,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    total: getCartTotal(items),
  };
}
