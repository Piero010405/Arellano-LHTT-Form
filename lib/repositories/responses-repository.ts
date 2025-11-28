// lib/repositories/responses-repository.ts
import { getSqlServerPool, sql } from "@/lib/db/sqlserver";
import type { FormResponseInput, FormResponse } from "@/lib/domain/response";

export async function insertFormResponse(
  data: FormResponseInput
): Promise<FormResponse> {
  const pool = await getSqlServerPool();
  const request = pool.request();

  request.input("Cluster", sql.NVarChar(50), data.cluster);
  request.input("CorreoArellano", sql.NVarChar(255), data.correoArellano);
  request.input("CodigoAlternativa", sql.Int, data.codigoAlternativa);

  // Nullable strings
  request.input("ProductDesc", sql.NVarChar(255), data.productDesc ?? null);

  // Nullable numbers — esto sí es válido
  request.input("NanKey", sql.Float, data.nankey ?? null);
  request.input("InventarioSala", sql.Int, data.inventarioSala ?? null);
  request.input("InventarioDeposito", sql.Int, data.inventarioDeposito ?? null);
  request.input("InventarioFrio", sql.Int, data.inventarioFrio ?? null);

  // CORRECCIÓN ABSOLUTA → NO usar Decimal(18,2)
  request.input("Precio", sql.Decimal, data.precio);


  const result = await request.query<{
    Id: number;
    Cluster: string;
    CorreoArellano: string;
    CodigoAlternativa: number;
    ProductDesc: string | null;
    NanKey: number | null;
    InventarioSala: number | null;
    InventarioDeposito: number | null;
    InventarioFrio: number | null;
    Precio: number;
    CreatedAt: Date;
  }>(`
    INSERT INTO dbo.FORM_ALTERNATIVAS_RESPONSES (
      Cluster,
      CorreoArellano,
      CodigoAlternativa,
      ProductDesc,
      NanKey,
      InventarioSala,
      InventarioDeposito,
      InventarioFrio,
      Precio
    )
    OUTPUT 
      inserted.Id,
      inserted.Cluster,
      inserted.CorreoArellano,
      inserted.CodigoAlternativa,
      inserted.ProductDesc,
      inserted.NanKey,
      inserted.InventarioSala,
      inserted.InventarioDeposito,
      inserted.InventarioFrio,
      inserted.Precio,
      inserted.CreatedAt
    VALUES (
      @Cluster,
      @CorreoArellano,
      @CodigoAlternativa,
      @ProductDesc,
      @NanKey,
      @InventarioSala,
      @InventarioDeposito,
      @InventarioFrio,
      @Precio
    );
  `);

  const row = result.recordset[0];

  return {
    id: row.Id,
    cluster: row.Cluster as any,
    correoArellano: row.CorreoArellano,
    codigoAlternativa: row.CodigoAlternativa,
    productDesc: row.ProductDesc,
    nankey: row.NanKey,
    inventarioSala: row.InventarioSala,
    inventarioDeposito: row.InventarioDeposito,
    inventarioFrio: row.InventarioFrio,
    precio: row.Precio,
    createdAt: row.CreatedAt.toISOString(),
  };
}
