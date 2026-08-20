import { useEffect, useState } from "react";

import { api } from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/routes";
import type { Order } from "@/types";

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    setError(false);
    try {
      const res = await api.get<Order[]>(API_ENDPOINTS.orders);
      setOrders(res.data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  function patchOrder(updated: Order) {
    setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
  }

  return { orders, loading, error, retry: fetchOrders, patchOrder };
}
