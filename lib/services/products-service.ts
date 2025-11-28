// lib/services/products-service.ts
import type { Product } from "@/lib/domain/product";
import { findProductsByDescription } from "@/lib/repositories/products-repository";

export async function searchProductsService(
  search: string,
  limit = 10
): Promise<Product[]> {
  const trimmed = search.trim().toLowerCase();

  if (trimmed.length < 2) {
    // mínimo 2 caracteres para evitar spam
    return [];
  }

  const safeLimit = Math.min(Math.max(limit, 1), 25); // 1–25

  return findProductsByDescription(trimmed, safeLimit);
}
