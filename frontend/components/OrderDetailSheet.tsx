"use client";

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
import { formatCurrency } from "@/lib/format";
import { useOrderDetail } from "@/hooks/use-order-detail";
import { STATUS_OPTIONS } from "@/constants/status";
import { ORDER_LOAD_ERROR, ORDER_STATUS_UPDATE_ERROR } from "@/constants/messages";
import type { Order, OrderStatus as OrderStatusValue } from "@/types";

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
  const { order, loading, error, updating, statusError, updateStatus, retry } =
    useOrderDetail(open ? orderId : null, onOrderUpdated);

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
              <p className="text-sm text-foreground">{ORDER_LOAD_ERROR}</p>
              <Button variant="outline" onClick={retry}>
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
                        updateStatus(value as OrderStatusValue)
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
                    {ORDER_STATUS_UPDATE_ERROR}
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
