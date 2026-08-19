"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  ChefHat,
  ClipboardList,
  Clock,
  XCircle,
} from "lucide-react";

import { OrderDetailSheet } from "@/components/OrderDetailSheet";
import { OrderStatus } from "@/components/OrderStatus";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { api } from "@/lib/api";
import { cn, formatCurrency } from "@/lib/utils";
import type { Order, OrderStatus as OrderStatusValue } from "@/types";

type StatusFilter = "ALL" | OrderStatusValue;

const STATUS_FILTERS: { key: StatusFilter; label: string }[] = [
  { key: "ALL", label: "All" },
  { key: "PENDING", label: "New Orders" },
  { key: "PREPARING", label: "On Cook" },
  { key: "COMPLETED", label: "Completed" },
  { key: "CANCELLED", label: "Cancelled" },
];

const STAT_CARDS: {
  key: "TOTAL" | OrderStatusValue;
  label: string;
  icon: typeof ClipboardList;
  iconClassName: string;
}[] = [
  {
    key: "TOTAL",
    label: "Total Orders",
    icon: ClipboardList,
    iconClassName: "bg-muted text-foreground",
  },
  {
    key: "PENDING",
    label: "Pending",
    icon: Clock,
    iconClassName: "bg-secondary text-secondary-foreground",
  },
  {
    key: "PREPARING",
    label: "Preparing",
    icon: ChefHat,
    iconClassName: "bg-primary/10 text-primary",
  },
  {
    key: "COMPLETED",
    label: "Completed",
    icon: CheckCircle2,
    iconClassName: "bg-emerald-500/10 text-emerald-600",
  },
  {
    key: "CANCELLED",
    label: "Cancelled",
    icon: XCircle,
    iconClassName: "bg-destructive/10 text-destructive",
  },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

  const filteredOrders =
    statusFilter === "ALL"
      ? orders
      : orders.filter((o) => o.status === statusFilter);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    setError(false);
    try {
      const res = await api.get<Order[]>("/orders");
      setOrders(res.data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <header className="sticky top-0 z-10 flex items-center gap-2 border-b border-border bg-background/95 px-4 py-4 backdrop-blur lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-foreground">Orders</h1>
          <p className="text-xs text-muted-foreground">
            {orders.length} order{orders.length === 1 ? "" : "s"} total
          </p>
        </div>
      </header>

      {!loading && !error && orders.length > 0 && (
        <div className="flex flex-wrap gap-2 border-b border-border px-4 py-3 lg:px-6">
          {STATUS_FILTERS.map(({ key, label }) => {
            const active = statusFilter === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setStatusFilter(key)}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground hover:bg-muted",
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}

      <div className="flex-1 px-4 py-4 lg:px-6">
        {loading && (
          <p className="py-16 text-center text-sm text-muted-foreground">
            Loading orders...
          </p>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <p className="text-sm text-foreground">
              Unable to load orders. Please try again.
            </p>
            <Button variant="outline" onClick={fetchOrders}>
              Retry
            </Button>
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <p className="py-16 text-center text-sm text-muted-foreground">
            No orders yet.
          </p>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-5">
            {STAT_CARDS.map(({ key, label, icon: Icon, iconClassName }) => {
              const count =
                key === "TOTAL"
                  ? orders.length
                  : orders.filter((o) => o.status === key).length;
              const active = key === "TOTAL" ? statusFilter === "ALL" : statusFilter === key;
              return (
                <Card
                  key={key}
                  onClick={() =>
                    setStatusFilter((prev) =>
                      key === "TOTAL" ? "ALL" : prev === key ? "ALL" : key,
                    )
                  }
                  className={cn(
                    "cursor-pointer gap-2 transition-colors",
                    active && "border-primary ring-1 ring-primary",
                  )}
                >
                  <CardContent className="flex items-center gap-3">
                    <span
                      className={cn(
                        "flex size-9 shrink-0 items-center justify-center rounded-lg",
                        iconClassName,
                      )}
                    >
                      <Icon className="size-4" />
                    </span>
                    <div>
                      <p className="text-xl font-bold text-foreground">
                        {count}
                      </p>
                      <p className="text-xs text-muted-foreground">{label}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {!loading && !error && orders.length > 0 && filteredOrders.length === 0 && (
          <p className="py-16 text-center text-sm text-muted-foreground">
            No orders match this status.
          </p>
        )}

        {!loading && !error && filteredOrders.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Order</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Total</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => {
                      setSelectedOrderId(order.id);
                      setSheetOpen(true);
                    }}
                    className="cursor-pointer border-b border-border last:border-0 hover:bg-muted/50"
                  >
                    <td className="px-4 py-3">
                      <span className="font-medium text-foreground">
                        #{order.id}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-foreground">
                      {order.customerName}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(order.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td className="px-4 py-3">
                      <OrderStatus status={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <OrderDetailSheet
        orderId={selectedOrderId}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onOrderUpdated={(updated) =>
          setOrders((prev) =>
            prev.map((o) => (o.id === updated.id ? updated : o)),
          )
        }
      />
    </>
  );
}
