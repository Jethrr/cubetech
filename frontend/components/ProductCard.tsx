"use client";

import Image from "next/image";
import { Minus, Plus, UtensilsCrossed } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
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
  return (
    <Card className="gap-3 py-0">
      <div className="relative flex aspect-video items-center justify-center overflow-hidden bg-muted">
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

      <CardContent className="flex flex-col gap-3 pb-4">
        <div>
          <Badge
            variant="secondary"
            className="mb-1.5 font-normal text-muted-foreground"
          >
            {product.category}
          </Badge>
          <h3 className="text-sm font-semibold text-foreground">
            {product.name}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatCurrency(product.price)}
          </p>
        </div>

        {quantity === 0 ? (
          <Button
            size="lg"
            className="w-full"
            onClick={onAdd}
            aria-label={`Add ${product.name} to cart`}
          >
            Add to Cart
          </Button>
        ) : (
          <div className="flex w-full items-center justify-between rounded-lg border border-input">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onDecrement}
              aria-label={`Decrease quantity of ${product.name}`}
              className="h-9 w-11"
            >
              <Minus className="size-4" />
            </Button>
            <span className="text-sm font-semibold text-foreground">
              {quantity}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onIncrement}
              aria-label={`Increase quantity of ${product.name}`}
              className="h-9 w-11"
            >
              <Plus className="size-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
