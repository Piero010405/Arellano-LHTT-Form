"use client";

import { useEffect, useState } from "react";

export interface ProductItem {
  productId: number;
  description: string;
}

export function useProductSearch(query: string) {
  const [results, setResults] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/products?search=${encodeURIComponent(query)}`, {
          signal: controller.signal,
        });

        const data = await res.json();
        setResults(data.items || []);
      } catch (err) {
        if (!(err instanceof Error) || err.name !== "AbortError") {
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query]);

  return { results, loading };
}
