// app/api/responses/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createFormResponseService } from "@/lib/services/responses-service";
import type { Cluster } from "@/lib/domain/response";

const clusterEnum: [Cluster, Cluster, Cluster] = [
  "Cluster Norte",
  "Cluster Centro",
  "Cluster Sur",
];

const formResponseSchema = z.object({
  cluster: z.enum(clusterEnum),
  correoArellano: z.string().email(),
  codigoAlternativa: z.number().int().min(1),
  productDesc: z.string().min(1).max(255).nullable().optional(),
  nankey: z.number().nullable().optional(),
  inventarioSala: z.number().int().min(0).nullable().optional(),
  inventarioDeposito: z.number().int().min(0).nullable().optional(),
  inventarioFrio: z.number().int().min(0).nullable().optional(),
  precio: z.number().positive(),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();

    const parsed = formResponseSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Body inválido",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const created = await createFormResponseService({
      cluster: data.cluster,
      correoArellano: data.correoArellano,
      codigoAlternativa: data.codigoAlternativa,
      productDesc: data.productDesc ?? null,
      nankey: data.nankey ?? null,
      inventarioSala: data.inventarioSala ?? null,
      inventarioDeposito: data.inventarioDeposito ?? null,
      inventarioFrio: data.inventarioFrio ?? null,
      precio: data.precio,
    });

    return NextResponse.json({ ok: true, response: created }, { status: 201 });
  } catch (error) {
    console.error("Error POST /api/responses:", error);
    return NextResponse.json(
      { error: "Error interno al registrar la respuesta" },
      { status: 500 }
    );
  }
}
