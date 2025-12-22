"use client";

import { X } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { useGeneralForm } from "@/contexts/general-form-context";
import ArellanoLoader from "@/components/arellano-loader";

interface Props {
  onCancel: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export default function ConfirmSubmitModal({
  onCancel,
  onConfirm,
  loading = false,
}: Props) {
  const { items } = useCart();
  const { general } = useGeneralForm();

  const totalProductos = items.length;
  const totalPrecio = items.reduce((acc, i) => acc + i.precio, 0);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[420px] shadow-xl relative">

        {/* LOADER OVERLAY */}
        {loading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
            <ArellanoLoader />
          </div>
        )}

        {/* HEADER */}
        <h3 className="text-lg font-semibold text-primary mb-4">
          Confirmar envío
        </h3>

        {/* DATOS GENERALES */}
        <div className="mb-4 text-sm space-y-1">
          <p>
            <strong>Cluster:</strong> {general.cluster || "-"}
          </p>
          <p>
            <strong>Correo:</strong> {general.email || "-"}
          </p>
          <p>
            <strong>Código alternativa:</strong> {general.codigo || "-"}
          </p>
        </div>

        {/* RESUMEN */}
        <div className="border rounded-md p-3 mb-5 bg-gray-50 text-sm">
          <p className="font-medium mb-1">Resumen de productos</p>
          <p>
            Productos: <strong>{totalProductos}</strong>
          </p>
          <p>
            Total estimado:{" "}
            <strong>S/ {totalPrecio.toFixed(2)}</strong>
          </p>
        </div>

        {/* BOTONES */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-3 py-2 bg-gray-200 rounded cursor-pointer disabled:opacity-60"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-3 py-2 bg-primary text-white rounded cursor-pointer disabled:opacity-60"
          >
            Confirmar envío
          </button>
        </div>

        {/* CLOSE */}
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="absolute right-3 top-3 text-gray-600 cursor-pointer disabled:opacity-50"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
