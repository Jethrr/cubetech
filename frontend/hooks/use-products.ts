import { useEffect, useState } from "react";

import { api } from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/routes";
import type { Product } from "@/types";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    setError(false);
    try {
      const res = await api.get<Product[]>(API_ENDPOINTS.products);
      setProducts(res.data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return { products, loading, error, retry: fetchProducts };
}
