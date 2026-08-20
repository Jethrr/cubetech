import type { OrderStatus } from "@/types";

export const ORDER_STATUSES: OrderStatus[] = [
  "PENDING",
  "PREPARING",
  "COMPLETED",
  "CANCELLED",
];

export const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; className: string }
> = {
  PENDING: {
    label: "Pending",
    className:
      "border-amber-200 bg-amber-100 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300",
  },
  PREPARING: {
    label: "Preparing",
    className:
      "border-blue-200 bg-blue-100 text-blue-800 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300",
  },
  COMPLETED: {
    label: "Completed",
    className:
      "border-emerald-200 bg-emerald-100 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300",
  },
  CANCELLED: {
    label: "Cancelled",
    className:
      "border-red-200 bg-red-100 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-300",
  },
};

// Dropdowns currently render the raw enum value, not STATUS_CONFIG.label — preserved as-is.
export const STATUS_OPTIONS = ORDER_STATUSES;

export type StatusFilterKey = "ALL" | OrderStatus;
export const STATUS_FILTERS: { key: StatusFilterKey; label: string }[] = [
  { key: "ALL", label: "All" },
  ...ORDER_STATUSES.map((key) => ({ key, label: STATUS_CONFIG[key].label })),
];

// Not derived from STATUS_CONFIG.label — card copy diverges ("Pending Orders" vs "Pending").
export type StatCardKey = "TOTAL" | OrderStatus;
export const ORDER_STAT_CARDS: { key: StatCardKey; label: string }[] = [
  { key: "TOTAL", label: "Total Orders" },
  { key: "PENDING", label: "Pending Orders" },
  { key: "PREPARING", label: "Preparing Orders" },
  { key: "COMPLETED", label: "Completed" },
  { key: "CANCELLED", label: "Cancelled" },
];
