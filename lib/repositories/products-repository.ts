// lib/repositories/products-repository.ts
import { getSqlServerPool, sql } from "@/lib/db/sqlserver";
import type { Product } from "@/lib/domain/product";

export async function findProductsByDescription(
  search: string,
  limit = 10
): Promise<Product[]> {
  const pool = await getSqlServerPool();

  const request = pool.request();
  request.input("search", sql.NVarChar(255), `%${search}%`);
  request.input("limit", sql.Int, limit);

  const result = await request.query<{
    PRODUCT_ID: number;
    Description: string;
  }>(`
    SELECT TOP (@limit)
      PRODUCT_ID,
      Description
    FROM dbo.FORM_ALTERNATIVAS_IMDB
    WHERE Description LIKE @search
    ORDER BY Description ASC;
  `);

  return result.recordset.map((row) => ({
    productId: row.PRODUCT_ID,
    description: row.Description,
  }));
}
