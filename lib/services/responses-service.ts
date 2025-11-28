// lib/services/responses-service.ts
import type {
  Cluster,
  FormResponseInput,
  FormResponse,
} from "@/lib/domain/response";
import { insertFormResponse } from "@/lib/repositories/responses-repository";

const ALLOWED_CLUSTERS: Cluster[] = [
  "Cluster Norte",
  "Cluster Centro",
  "Cluster Sur",
];

export async function createFormResponseService(
  input: FormResponseInput
): Promise<FormResponse> {
  if (!ALLOWED_CLUSTERS.includes(input.cluster)) {
    throw new Error("Cluster inválido");
  }

  const sanitized: FormResponseInput = {
    ...input,
    correoArellano: input.correoArellano.trim().toLowerCase(),
    productDesc: input.productDesc?.trim() || null,
  };

  return insertFormResponse(sanitized);
}
