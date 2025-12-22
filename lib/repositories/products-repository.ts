// lib/repositories/products-repository.ts
import { supabase } from "@/lib/db/supabase";
import type { Product } from "@/lib/domain/product";

export async function findProductsByDescriptionFTS(
  search: string,
  limit = 10
): Promise<Product[]> {
  const { data, error } = await supabase.rpc("search_products_fts", {
    search_text: search,
    lim: limit,
  });

  if (error) {
    console.error("Supabase FTS error:", error);
    throw new Error("Error consultando productos");
  }

  return (
    data?.map((row: any) => ({
      productId: row.product_id,
      description: row.description,
    })) ?? []
  );
}

export async function findProductsByDescription(
  search: string,
  limit = 10
): Promise<Product[]> {

  const { data, error } = await supabase
    .from("form_alternativas_imdb")
    .select("product_id, description")
    .ilike("description", `${search}%`) // prefijo, más rápido
    .order("description", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("Supabase error:", error);
    throw new Error("Error consultando Supabase");
  }

  return (
    data?.map((row) => ({
      productId: row.product_id,
      description: row.description,
    })) ?? []
  );
}
