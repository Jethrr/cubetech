"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle2, ShoppingBag, Store } from "lucide-react";

import { Cart } from "@/components/Cart";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { api } from "@/lib/api";
import { cn, formatCurrency } from "@/lib/utils";
import type { CartItem, Order, Product } from "@/types";

const GENERIC_SUBMIT_ERROR = "Unable to place your order. Please try again.";
const UNAVAILABLE_SUBMIT_ERROR =
  "Some items in your cart are no longer available. Please review your order.";

export default function OrderPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    setError(false);
    try {
      const res = await api.get<Product[]>("/products");
      setProducts(res.data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  function addToCart(product: Product) {
    setCart((prev) => [
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
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    );
  }

  function decrementItem(productId: number) {
    setCart((prev) =>
      prev.flatMap((item) => {
        if (item.productId !== productId) return [item];
        if (item.quantity <= 1) return [];
        return [{ ...item, quantity: item.quantity - 1 }];
      }),
    );
  }

  function removeItem(productId: number) {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  }

  function clearCart() {
    setCart([]);
  }

  async function handlePlaceOrder() {
    if (submitting) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await api.post<Order>("/orders", {
        customerName,
        items: cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      });
      setConfirmedOrder(res.data);
      clearCart();
      setCustomerName("");
      setCartOpen(false);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 400) {
        setSubmitError(UNAVAILABLE_SUBMIT_ERROR);
      } else {
        setSubmitError(GENERIC_SUBMIT_ERROR);
      }
    } finally {
      setSubmitting(false);
    }
  }

  function startNewOrder() {
    setConfirmedOrder(null);
    setSubmitError(null);
  }

  const categories = ["All", ...new Set(products.map((p) => p.category))];
  const visibleProducts =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.quantity,
    0,
  );

  if (confirmedOrder) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background px-4">
        <Card className="w-full max-w-sm">
          <CardContent className="flex flex-col items-center gap-2 py-4 text-center">
            <CheckCircle2 className="size-10 text-primary" />
            <h1 className="text-lg font-semibold text-foreground">
              Order Submitted!
            </h1>
            <p className="text-sm text-muted-foreground">
              Thank you, {confirmedOrder.customerName}!
            </p>
            <p className="mt-2 text-sm font-medium text-foreground">
              Order #{confirmedOrder.id}
            </p>
            <p className="text-xl font-bold text-foreground">
              Total: {formatCurrency(confirmedOrder.totalAmount)}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Your order is being prepared.
            </p>
            <Button className="mt-4 w-full" onClick={startNewOrder}>
              Place Another Order
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-svh flex-col lg:h-svh lg:overflow-hidden">
      <div className="flex flex-1 flex-col lg:min-h-0 lg:flex-row lg:overflow-hidden">
        {/* Menu */}
        <div className="flex flex-1 flex-col lg:min-w-0 lg:overflow-y-auto">
          <header className="sticky top-0 z-10 flex items-center gap-2 border-b border-border bg-background/95 px-4 py-4 backdrop-blur lg:px-6">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Store className="size-4" />
            </span>
            <h1 className="text-lg font-semibold text-foreground">Menu</h1>
          </header>

          <main
            className={cn(
              "flex-1 px-4 py-4 lg:px-6",
              itemCount > 0 && "pb-24 lg:pb-6",
            )}
          >
            {loading && (
              <p className="py-16 text-center text-sm text-muted-foreground">
                Loading menu...
              </p>
            )}

            {!loading && error && (
              <div className="flex flex-col items-center gap-3 py-16 text-center">
                <p className="text-sm text-foreground">
                  Unable to load menu. Please try again.
                </p>
                <Button variant="outline" onClick={fetchProducts}>
                  Retry
                </Button>
              </div>
            )}

            {!loading && !error && products.length === 0 && (
              <p className="py-16 text-center text-sm text-muted-foreground">
                No items available right now.
              </p>
            )}

            {!loading && !error && products.length > 0 && (
              <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={cn(
                      "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                      activeCategory === category
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:bg-muted",
                    )}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}

            {!loading &&
              !error &&
              products.length > 0 &&
              visibleProducts.length === 0 && (
                <p className="py-16 text-center text-sm text-muted-foreground">
                  No items in this category.
                </p>
              )}

            {!loading && !error && visibleProducts.length > 0 && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4 xl:grid-cols-5">
                {visibleProducts.map((product) => {
                  const cartItem = cart.find(
                    (i) => i.productId === product.id,
                  );
                  return (
                    <ProductCard
                      key={product.id}
                      product={product}
                      quantity={cartItem?.quantity ?? 0}
                      onAdd={() => addToCart(product)}
                      onIncrement={() => incrementItem(product.id)}
                      onDecrement={() => decrementItem(product.id)}
                    />
                  );
                })}
              </div>
            )}
          </main>
        </div>

        {/* Cart panel (desktop only) */}
        <aside className="hidden w-96 shrink-0 flex-col border-l border-border bg-card lg:flex lg:overflow-hidden">
          <div className="border-b border-border px-4 py-4">
            <h2 className="text-lg font-semibold text-foreground">
              Order Summary
            </h2>
          </div>
          <Cart
            items={cart}
            customerName={customerName}
            onCustomerNameChange={setCustomerName}
            onIncrement={incrementItem}
            onDecrement={decrementItem}
            onRemove={removeItem}
            onClear={clearCart}
            onSubmit={handlePlaceOrder}
            submitting={submitting}
            submitError={submitError}
          />
        </aside>
      </div>

      {/* Sticky cart button (mobile only) */}
      {itemCount > 0 && (
        <Button
          type="button"
          size="lg"
          onClick={() => setCartOpen(true)}
          className="fixed inset-x-4 bottom-4 z-20 h-auto justify-between rounded-2xl px-4 py-3 shadow-lg lg:hidden"
        >
          <span className="flex items-center gap-2 text-sm font-semibold">
            <ShoppingBag className="size-4" />
            View Cart · {itemCount} item{itemCount > 1 ? "s" : ""}
          </span>
          <span className="text-sm font-bold">{formatCurrency(total)}</span>
        </Button>
      )}

      {/* Cart drawer (mobile only) */}
      <Sheet open={cartOpen} onOpenChange={setCartOpen}>
        <SheetContent
          side="bottom"
          className="max-h-[85vh] rounded-t-3xl p-0 lg:hidden"
        >
          <SheetHeader className="border-b border-border px-4 py-4">
            <SheetTitle>Order Summary</SheetTitle>
          </SheetHeader>
          <Cart
            items={cart}
            customerName={customerName}
            onCustomerNameChange={setCustomerName}
            onIncrement={incrementItem}
            onDecrement={decrementItem}
            onRemove={removeItem}
            onClear={clearCart}
            onSubmit={handlePlaceOrder}
            submitting={submitting}
            submitError={submitError}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}
