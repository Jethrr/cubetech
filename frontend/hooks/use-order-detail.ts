import { useEffect, useState } from "react";

import { api } from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/routes";
import type { Order, OrderStatus } from "@/types";

export function useOrderDetail(
  orderId: number | string | null,
  onOrderUpdated?: (order: Order) => void,
) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [statusError, setStatusError] = useState(false);

  useEffect(() => {
    if (orderId === null) return;
    fetchOrder(orderId);
  }, [orderId]);

  async function fetchOrder(id: number | string) {
    setOrder(null);
    setLoading(true);
    setError(false);
    try {
      const res = await api.get<Order>(API_ENDPOINTS.order(id));
      setOrder(res.data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(status: OrderStatus) {
    if (!order || updating || status === order.status) return;
    setUpdating(true);
    setStatusError(false);
    try {
      const res = await api.patch<Order>(API_ENDPOINTS.orderStatus(order.id), {
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

  return {
    order,
    loading,
    error,
    updating,
    statusError,
    updateStatus,
    retry: () => orderId !== null && fetchOrder(orderId),
  };
}
