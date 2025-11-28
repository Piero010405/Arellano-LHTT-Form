// lib/repositories/responses-repository.ts
import { supabase } from "@/lib/db/supabase";
import type { FormResponseInput, FormResponse } from "@/lib/domain/response";

export async function insertFormResponse(
  data: FormResponseInput
): Promise<FormResponse> {
  const { data: inserted, error } = await supabase
    .from("form_alternativas_responses")
    .insert({
      cluster: data.cluster,
      correo_arellano: data.correoArellano,
      codigo_alternativa: data.codigoAlternativa,
      product_desc: data.productDesc,
      nankey: data.nankey,
      inventario_sala: data.inventarioSala,
      inventario_deposito: data.inventarioDeposito,
      inventario_frio: data.inventarioFrio,
      precio: data.precio,
    })
    .select()
    .single();

  if (error) {
    console.error("❌ Error insertando en Supabase:", error);
    throw new Error(error.message);
  }

  return {
    id: inserted.id,
    cluster: inserted.cluster,
    correoArellano: inserted.correo_arellano,
    codigoAlternativa: inserted.codigo_alternativa,
    productDesc: inserted.product_desc,
    nankey: inserted.nankey,
    inventarioSala: inserted.inventario_sala,
    inventarioDeposito: inserted.inventario_deposito,
    inventarioFrio: inserted.inventario_frio,
    precio: inserted.precio,
    createdAt: inserted.created_at,
  };
}
