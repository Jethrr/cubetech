import { Badge } from "@/components/ui/badge";
import type { OrderStatus as OrderStatusValue } from "@/types";

type BadgeVariant = "default" | "secondary" | "outline" | "destructive";

const STATUS_CONFIG: Record<
  OrderStatusValue,
  { label: string; variant: BadgeVariant }
> = {
  PENDING: { label: "Pending", variant: "secondary" },
  PREPARING: { label: "Preparing", variant: "default" },
  COMPLETED: { label: "Completed", variant: "outline" },
  CANCELLED: { label: "Cancelled", variant: "destructive" },
};

interface OrderStatusProps {
  status: OrderStatusValue;
  className?: string;
}

export function OrderStatus({ status, className }: OrderStatusProps) {
  const { label, variant } = STATUS_CONFIG[status];
  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  );
}
