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
      <div className="bg-white rounded-lg w-[640px] max-h-[85vh] shadow-xl relative flex flex-col">

        {/* LOADING OVERLAY */}
        {loading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-20 rounded-lg">
            <ArellanoLoader />
          </div>
        )}

        {/* HEADER (FIJO) */}
        <div className="px-6 py-4 border-b shrink-0">
          <h3 className="text-lg font-semibold text-primary">
            Confirmar envío
          </h3>
        </div>

        {/* CONTENT (SCROLL) */}
        <div className="px-6 py-4 space-y-4 text-sm overflow-y-auto flex-1">

          {/* DATOS GENERALES */}
          <div className="space-y-1">
            <p><strong>Cluster:</strong> {general.cluster}</p>
            <p><strong>Correo:</strong> {general.email}</p>
            <p><strong>Código alternativa:</strong> {general.codigo}</p>
          </div>

          {/* RESUMEN */}
          <div className="border rounded-md p-3 bg-gray-50">
            <p className="font-medium mb-1">Resumen</p>
            <p>Productos: <strong>{totalProductos}</strong></p>
            <p>Total estimado: <strong>S/ {totalPrecio.toFixed(2)}</strong></p>
          </div>

          {/* LISTA DE PRODUCTOS */}
          <div className="border rounded-md overflow-hidden">
            {/* HEADER TABLA */}
            <div className="bg-gray-100 px-3 py-2 text-xs font-semibold grid grid-cols-5 sticky top-0 z-10">
              <span className="col-span-2">Producto</span>
              <span className="text-center">Inventario</span>
              <span className="text-right">Precio</span>
              <span></span>
            </div>

            {/* BODY TABLA */}
            <div className="divide-y">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-5 px-3 py-2 text-xs items-center"
                >
                  <div className="col-span-2 leading-tight">
                    {item.description}
                  </div>

                  <div className="text-center text-gray-700">
                    {item.inventarioSala}/{item.inventarioDeposito}/{item.inventarioFrio}
                  </div>

                  <div className="text-right font-medium">
                    S/ {item.precio.toFixed(2)}
                  </div>

                  <div />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FOOTER (FIJO SIEMPRE VISIBLE) */}
        <div className="px-6 py-4 border-t flex justify-end gap-3 shrink-0 bg-white">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 bg-gray-200 rounded cursor-pointer"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 bg-primary text-white rounded cursor-pointer"
          >
            Confirmar envío
          </button>
        </div>

        {/* CLOSE */}
        <button
          type="button"
          onClick={onCancel}
          className="absolute right-4 top-4 text-gray-600 cursor-pointer"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}