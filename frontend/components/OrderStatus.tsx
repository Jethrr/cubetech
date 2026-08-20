import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { STATUS_CONFIG } from "@/constants/status";
import type { OrderStatus as OrderStatusValue } from "@/types";

interface OrderStatusProps {
  status: OrderStatusValue;
  className?: string;
}

export function OrderStatus({ status, className }: OrderStatusProps) {
  const { label, className: statusClassName } = STATUS_CONFIG[status];
  return (
    <Badge variant="outline" className={cn(statusClassName, className)}>
      {label}
    </Badge>
  );
}
