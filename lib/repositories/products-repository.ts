// lib/repositories/products-repository.ts
import { supabase } from "@/lib/db/supabase";
import type { Product } from "@/lib/domain/product";

export async function findProductsByDescription(
  search: string,
  limit = 10
): Promise<Product[]> {
  const { data, error } = await supabase.rpc("search_products_smart", {
    search_text: search,
    lim: limit,
  });

  if (error) {
    console.error("Supabase search_products_smart error:", error);
    throw new Error("Error consultando productos");
  }

  return (
    data?.map((row: any) => ({
      productId: row.product_id,
      description: row.description,
    })) ?? []
  );
}
