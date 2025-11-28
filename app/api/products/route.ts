// app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { searchProductsService } from "@/lib/services/products-service";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") ?? "";
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : 10;

    const items = await searchProductsService(search, limit);

    return NextResponse.json({ items }, { status: 200 });
  } catch (error) {
    console.error("Error GET /api/products:", error);
    return NextResponse.json(
      { error: "Error interno al buscar productos" },
      { status: 500 }
    );
  }
}
