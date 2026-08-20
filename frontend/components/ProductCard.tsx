"use client";

import Image from "next/image";
import { Check, Minus, Plus, UtensilsCrossed } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  quantity: number;
  onAdd: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
}

export function ProductCard({
  product,
  quantity,
  onAdd,
  onIncrement,
  onDecrement,
}: ProductCardProps) {
  function handleGrow() {
    if (quantity === 0) {
      onAdd();
    } else {
      onIncrement();
    }
  }

  return (
    <Card className="gap-0 overflow-hidden rounded-2xl py-0 shadow-sm">
      <div className="relative flex aspect-4/3 items-center justify-center overflow-hidden bg-muted">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(min-width: 768px) 25vw, 50vw"
            className="object-cover"
          />
        ) : (
          <UtensilsCrossed className="size-8 text-muted-foreground/50" />
        )}
      </div>

      <CardContent className="flex flex-col gap-2.5 p-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-sm font-semibold text-foreground">
            {product.name}
          </h3>
          <span className="shrink-0 text-sm font-bold text-primary">
            {formatCurrency(product.price)}
          </span>
        </div>

        <div className="flex flex-col items-stretch gap-1.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center justify-between gap-1 rounded-full border border-input px-1 py-0.5 sm:justify-start sm:gap-2 sm:py-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={quantity === 0}
              onClick={onDecrement}
              aria-label={`Decrease quantity of ${product.name}`}
              className="size-6 rounded-full disabled:opacity-30"
            >
              <Minus className="size-3.5" />
            </Button>
            <span className="min-w-3 text-center text-xs font-semibold text-foreground">
              {quantity}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleGrow}
              aria-label={`Increase quantity of ${product.name}`}
              className="size-6 rounded-full"
            >
              <Plus className="size-3.5" />
            </Button>
          </div>

          <Button
            type="button"
            size="sm"
            variant={quantity > 0 ? "secondary" : "default"}
            onClick={handleGrow}
            aria-label={`Add ${product.name} to cart`}
            className="h-8 w-full gap-1 rounded-full px-3 text-xs font-semibold transition-all sm:w-auto"
          >
            {quantity > 0 ? (
              <>
                <Check className="size-3.5" />
                Added
              </>
            ) : (
              "Add Item"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
