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
  productDesc: z.string().min(1).max(255),
  nankey: z.number().positive(),
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
      const flat = parsed.error.flatten();

      return NextResponse.json(
        {
          error: "Body inválido",
          fieldErrors: flat.fieldErrors,
          formErrors: flat.formErrors,
          received: json,
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

    // Generamos ID simple (puede mejorarse si quieres)
    const registroId = `${data.codigoAlternativa}-${data.nankey ?? "0"}`;

    return NextResponse.json(
      {
        success: true,
        registroId,
        response: created,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error POST /api/responses:", error);
    return NextResponse.json(
      { error: "Error interno al registrar la respuesta" },
      { status: 500 }
    );
  }
}
