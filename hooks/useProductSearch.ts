"use client";

import { useEffect, useRef, useState } from "react";
import { supabaseBrowser } from "@/lib/db/supabase-browser";

export interface ProductItem {
  productId: number;
  description: string;
}

export function useProductSearch(query: string) {
  const [results, setResults] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(false);
  const lastQueryRef = useRef<string>("");

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      return;
    }

    // 🔒 dedupe (clave)
    if (q === lastQueryRef.current) return;
    lastQueryRef.current = q;

    const controller = new AbortController();

    const run = async () => {
      try {
        setLoading(true);

        const { data, error } = await supabaseBrowser.rpc(
          "search_products_smart",
          {
            search_text: q,
            lim: 10,
          }
        );
        
        if (!error) {
          setResults(
            (data ?? []).map((r: any) => ({
              productId: r.product_id,
              description: r.description,
            }))
          );
        }
      } finally {
        setLoading(false);
      }
    };

    const t = setTimeout(run, 200);

    return () => {
      clearTimeout(t);
      controller.abort();
    };
  }, [query]);

  return { results, loading };
}
