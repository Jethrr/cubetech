"use client";

import { useEffect, useMemo, useState } from "react";
import { Calendar, Clock, Search } from "lucide-react";

import { OrderDetailSheet } from "@/components/OrderDetailSheet";
import { OrderStatus } from "@/components/OrderStatus";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/format";
import { useOrders } from "@/hooks/use-orders";
import {
  STATUS_FILTERS,
  ORDER_STAT_CARDS,
  type StatusFilterKey,
  type StatCardKey,
} from "@/constants/status";
import { PAGE_SIZE_OPTIONS, DEFAULT_PAGE_SIZE } from "@/constants/config";
import { ORDERS_LOAD_ERROR } from "@/constants/messages";

export default function AdminOrdersPage() {
  const { orders, loading, error, retry, patchOrder } = useOrders();
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilterKey>("ALL");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();
    return orders.filter((o) => {
      const matchesStatus = statusFilter === "ALL" || o.status === statusFilter;
      const matchesSearch =
        !query ||
        o.customerName.toLowerCase().includes(query) ||
        String(o.id).includes(query);
      return matchesStatus && matchesSearch;
    });
  }, [orders, statusFilter, search]);

  const pageCount = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pagedOrders = filteredOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  useEffect(() => {
    setPage(1);
  }, [statusFilter, search, pageSize]);

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

      <div className="flex flex-1 flex-col px-4 py-4 lg:px-6">
        {loading && (
          <p className="py-16 text-center text-sm text-muted-foreground">
            Loading orders...
          </p>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <p className="text-sm text-foreground">{ORDERS_LOAD_ERROR}</p>
            <Button variant="outline" onClick={retry}>
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
          <>
            {/* stat cards */}
            {(() => {
              const statCard = (key: StatCardKey, label: string) => {
                const count =
                  key === "TOTAL"
                    ? orders.length
                    : orders.filter((o) => o.status === key).length;
                const active =
                  key === "TOTAL" ? statusFilter === "ALL" : statusFilter === key;
                return (
                  <Card
                    key={key}
                    onClick={() =>
                      setStatusFilter((prev) =>
                        key === "TOTAL" ? "ALL" : prev === key ? "ALL" : key,
                      )
                    }
                    className={cn(
                      "cursor-pointer gap-1 border-transparent bg-card py-4 shadow-none ring-0 transition-colors",
                      active && "ring-1 ring-primary",
                    )}
                  >
                    <CardContent>
                      <p className="text-2xl font-bold text-foreground">{count}</p>
                      <p className="text-xs text-muted-foreground">{label}</p>
                    </CardContent>
                  </Card>
                );
              };

              return (
                <div className="mb-4">
                  {/* mobile: total as its own row, rest in a 4-col grid */}
                  <div className="flex flex-col gap-3 sm:hidden">
                    {statCard("TOTAL", "Total Orders")}
                    <div className="grid grid-cols-4 gap-3">
                      {ORDER_STAT_CARDS.filter(({ key }) => key !== "TOTAL").map(
                        ({ key, label }) => statCard(key, label),
                      )}
                    </div>
                  </div>

                  {/* tablet/desktop: single grid */}
                  <div className="hidden gap-3 sm:grid sm:grid-cols-3 lg:grid-cols-5">
                    {ORDER_STAT_CARDS.map(({ key, label }) => statCard(key, label))}
                  </div>
                </div>
              );
            })()}

            {/* filters + search */}
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex w-fit gap-1 overflow-x-auto scrollbar-none rounded-full bg-muted p-1">
                {STATUS_FILTERS.map(({ key, label }) => {
                  const active = statusFilter === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setStatusFilter(key)}
                      className={cn(
                        "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                        active
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              <div className="relative sm:w-64">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="h-9 pl-8"
                />
              </div>
            </div>

            {filteredOrders.length === 0 && (
              <p className="py-16 text-center text-sm text-muted-foreground">
                No orders match this filter.
              </p>
            )}

            {filteredOrders.length > 0 && (
              <>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {pagedOrders.map((order) => {
                    const createdAt = new Date(order.createdAt);
                    const itemCount =
                      order.itemCount ??
                      order.items?.reduce((sum, i) => sum + i.quantity, 0) ??
                      0;
                    return (
                      <Card
                        key={order.id}
                        onClick={() => {
                          setSelectedOrderId(order.id);
                          setSheetOpen(true);
                        }}
                        className="cursor-pointer gap-3 py-4 transition-shadow hover:shadow-md"
                      >
                        <CardContent className="flex flex-col gap-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="truncate font-semibold text-foreground">
                                {order.customerName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Order #{order.id}
                              </p>
                            </div>
                            <OrderStatus status={order.status} className="shrink-0" />
                          </div>

                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="size-3.5" />
                              {createdAt.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                              })}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="size-3.5" />
                              {createdAt.toLocaleDateString()}
                            </span>
                          </div>

                          <div className="flex items-center justify-between border-t border-border pt-3">
                            <span className="text-sm text-muted-foreground">
                              {itemCount} Item{itemCount === 1 ? "" : "s"}
                            </span>
                            <span className="font-bold text-foreground">
                              {formatCurrency(order.totalAmount)}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* pagination */}
                <div className="mt-auto flex flex-col items-center justify-between gap-3 pt-4 sm:flex-row">
                  <p className="text-sm text-muted-foreground">
                    Page {currentPage} of {pageCount}
                  </p>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={currentPage === 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                      &lsaquo;
                    </Button>
                    {Array.from({ length: pageCount }, (_, i) => i + 1)
                      .filter(
                        (p) =>
                          p === 1 ||
                          p === pageCount ||
                          Math.abs(p - currentPage) <= 1,
                      )
                      .reduce<number[]>((acc, p) => {
                        if (acc.length && p - acc[acc.length - 1] > 1) acc.push(-1);
                        acc.push(p);
                        return acc;
                      }, [])
                      .map((p, idx) =>
                        p === -1 ? (
                          <span
                            key={`gap-${idx}`}
                            className="px-1 text-sm text-muted-foreground"
                          >
                            ..
                          </span>
                        ) : (
                          <Button
                            key={p}
                            variant={p === currentPage ? "default" : "outline"}
                            size="icon"
                            onClick={() => setPage(p)}
                          >
                            {p}
                          </Button>
                        ),
                      )}
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={currentPage === pageCount}
                      onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                    >
                      &rsaquo;
                    </Button>
                  </div>

                  <Select
                    value={String(pageSize)}
                    onValueChange={(v) => setPageSize(Number(v))}
                  >
                    <SelectTrigger size="sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PAGE_SIZE_OPTIONS.map((size) => (
                        <SelectItem key={size} value={String(size)}>
                          {size} per page
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </>
        )}
      </div>

      <OrderDetailSheet
        orderId={selectedOrderId}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onOrderUpdated={patchOrder}
      />
    </>
  );
}
