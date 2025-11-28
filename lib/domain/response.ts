// lib/domain/response.ts

export type Cluster = "Cluster Norte" | "Cluster Centro" | "Cluster Sur";

export interface FormResponseInput {
  cluster: Cluster;
  correoArellano: string;
  codigoAlternativa: number;
  productDesc: string | null;
  nankey: number | null;
  inventarioSala: number | null;
  inventarioDeposito: number | null;
  inventarioFrio: number | null;
  precio: number;
}

export interface FormResponse extends FormResponseInput {
  id: number;
  createdAt: string; // ISO string
}
