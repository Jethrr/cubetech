"use client";

import { useEffect, useState } from "react";

import { OrderStatus } from "@/components/OrderStatus";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import type { Order, OrderStatus as OrderStatusValue } from "@/types";

const STATUS_OPTIONS: OrderStatusValue[] = [
  "PENDING",
  "PREPARING",
  "COMPLETED",
  "CANCELLED",
];

export function OrderDetailSheet({
  orderId,
  open,
  onOpenChange,
  onOrderUpdated,
}: {
  orderId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOrderUpdated?: (order: Order) => void;
}) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [statusError, setStatusError] = useState(false);

  useEffect(() => {
    if (!open || orderId === null) return;
    setOrder(null);
    fetchOrder(orderId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, orderId]);

  async function fetchOrder(id: number) {
    setLoading(true);
    setError(false);
    try {
      const res = await api.get<Order>(`/orders/${id}`);
      setOrder(res.data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(status: OrderStatusValue) {
    if (!order || updating || status === order.status) return;
    setUpdating(true);
    setStatusError(false);
    try {
      const res = await api.patch<Order>(`/orders/${order.id}/status`, {
        status,
      });
      setOrder(res.data);
      onOrderUpdated?.(res.data);
    } catch {
      setStatusError(true);
    } finally {
      setUpdating(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{order ? `Order #${order.id}` : "Order"}</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {loading && (
            <p className="py-16 text-center text-sm text-muted-foreground">
              Loading order...
            </p>
          )}

          {!loading && error && (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <p className="text-sm text-foreground">
                Unable to load order. Please try again.
              </p>
              <Button
                variant="outline"
                onClick={() => orderId !== null && fetchOrder(orderId)}
              >
                Retry
              </Button>
            </div>
          )}

          {!loading && !error && order && (
            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Customer</p>
                    <p className="text-base font-semibold text-foreground">
                      {order.customerName}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <OrderStatus status={order.status} />
                    <Select
                      value={order.status}
                      onValueChange={(value) =>
                        handleStatusChange(value as OrderStatusValue)
                      }
                      disabled={updating}
                    >
                      <SelectTrigger size="sm" aria-label="Update order status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {statusError && (
                  <p className="mt-2 text-xs text-destructive" role="alert">
                    Unable to update status. Please try again.
                  </p>
                )}
              </div>

              <div className="overflow-hidden rounded-xl border border-border bg-card">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs text-muted-foreground">
                      <th className="px-4 py-3 font-medium">Item</th>
                      <th className="px-4 py-3 font-medium">Price</th>
                      <th className="px-4 py-3 font-medium">Qty</th>
                      <th className="px-4 py-3 text-right font-medium">
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items?.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-border last:border-0"
                      >
                        <td className="px-4 py-3 text-foreground">
                          {item.productName}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {formatCurrency(item.price)}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-foreground">
                          {formatCurrency(item.subtotal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td
                        colSpan={3}
                        className="px-4 py-3 text-sm font-semibold text-foreground"
                      >
                        Total
                      </td>
                      <td className="px-4 py-3 text-right text-base font-bold text-foreground">
                        {formatCurrency(order.totalAmount)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
