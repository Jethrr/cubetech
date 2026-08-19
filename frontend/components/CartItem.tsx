"use client";

import Image from "next/image";
import { Minus, Plus, Trash2, UtensilsCrossed } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import type { CartItem as CartItemType } from "@/types";

interface CartItemProps {
  item: CartItemType;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}

export function CartItem({
  item,
  onIncrement,
  onDecrement,
  onRemove,
}: CartItemProps) {
  const subtotal = parseFloat(item.price) * item.quantity;

  return (
    <div className="flex gap-3 rounded-xl border border-border p-3">
      <div className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            sizes="64px"
            className="object-cover"
          />
        ) : (
          <UtensilsCrossed className="size-5 text-muted-foreground/50" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="truncate text-sm font-semibold text-foreground">
            {item.name}
          </p>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={onRemove}
            aria-label={`Remove ${item.name} from cart`}
            className="-mt-1 -mr-1 shrink-0 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {formatCurrency(item.price)} each
        </p>

        <div className="mt-2 flex items-center justify-between gap-2 rounded-lg bg-muted px-2 py-1.5">
          <span className="text-xs text-muted-foreground">Subtotal</span>
          <span className="text-sm font-semibold text-foreground">
            {formatCurrency(subtotal)}
          </span>
        </div>

        <div className="mt-2 flex justify-end">
          <div className="flex items-center gap-1 rounded-lg border border-input">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={onDecrement}
              aria-label={`Decrease quantity of ${item.name}`}
            >
              <Minus className="size-3.5" />
            </Button>
            <span className="w-4 text-center text-sm font-semibold text-foreground">
              {item.quantity}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={onIncrement}
              aria-label={`Increase quantity of ${item.name}`}
            >
              <Plus className="size-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
