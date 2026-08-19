"use client";

import { Trash2 } from "lucide-react";

import { CartItem } from "@/components/CartItem";
import { OrderForm } from "@/components/OrderForm";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import type { CartItem as CartItemType } from "@/types";

interface CartProps {
  items: CartItemType[];
  customerName: string;
  onCustomerNameChange: (value: string) => void;
  onIncrement: (productId: number) => void;
  onDecrement: (productId: number) => void;
  onRemove: (productId: number) => void;
  onClear: () => void;
  onSubmit: () => void;
  submitting?: boolean;
  submitError?: string | null;
}

export function Cart({
  items,
  customerName,
  onCustomerNameChange,
  onIncrement,
  onDecrement,
  onRemove,
  onClear,
  onSubmit,
  submitting = false,
  submitError = null,
}: CartProps) {
  const total = items.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.quantity,
    0,
  );
  const canPlaceOrder = items.length > 0;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex shrink-0 items-center justify-between px-4 pt-4">
        <h3 className="text-sm font-semibold text-foreground">Order Items</h3>
        {items.length > 0 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 />
            Clear
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-1 px-4 py-16 text-center">
          <p className="text-sm font-semibold text-foreground">
            Your cart is empty
          </p>
          <p className="text-sm text-muted-foreground">
            Add items from the menu to get started.
          </p>
        </div>
      ) : (
        <div className="mt-2 flex-1 space-y-3 overflow-y-auto px-4 pb-4">
          {items.map((item) => (
            <CartItem
              key={item.productId}
              item={item}
              onIncrement={() => onIncrement(item.productId)}
              onDecrement={() => onDecrement(item.productId)}
              onRemove={() => onRemove(item.productId)}
            />
          ))}
        </div>
      )}

      <div className="shrink-0 border-t border-border px-4 pt-4 pb-6">
        <h3 className="text-sm font-semibold text-foreground">Subtotal</h3>
        <div className="mt-2 space-y-1.5">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex items-center justify-between gap-2"
            >
              <span className="min-w-0 truncate text-sm text-muted-foreground">
                {item.name} ({formatCurrency(item.price)} × {item.quantity})
              </span>
              <span className="shrink-0 text-sm text-foreground">
                {formatCurrency(parseFloat(item.price) * item.quantity)}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-2 flex items-center justify-between border-t border-border pt-2">
          <span className="text-base font-semibold text-foreground">
            Grand Total
          </span>
          <span className="text-lg font-bold text-foreground">
            {formatCurrency(total)}
          </span>
        </div>
        <div className="mt-4">
          <OrderForm
            customerName={customerName}
            onCustomerNameChange={onCustomerNameChange}
            onSubmit={onSubmit}
            disabled={!canPlaceOrder}
            submitting={submitting}
            error={submitError}
          />
        </div>
      </div>
    </div>
  );
}
