// components/cart-list.tsx
"use client";

import { useState } from "react";
import { useCart } from "@/contexts/cart-context";
import { Pencil, Trash2 } from "lucide-react";
import CartEditModal from "./cart-edit-modal";
import ConfirmDeleteModal from "./confirm-delete-modal";

export default function CartList() {
  const { items } = useCart();

  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  if (items.length === 0)
    return (
      <p className="text-center text-gray-500 text-sm">
        No has agregado productos.
      </p>
    );

  return (
    <div className="mt-4 border rounded-lg overflow-hidden bg-white shadow-sm">

      {/* Header */}
      <div className="grid grid-cols-5 text-xs font-semibold bg-gray-100 py-2 px-3 border-b">
        <span className="col-span-2">Producto</span>
        <span className="text-center">Inv.</span>
        <span className="text-center">Precio</span>
        <span className="text-center">Acciones</span>
      </div>

      {/* Items */}
      {items.map((item, index) => (
        <div
          key={index}
          className="grid grid-cols-5 items-center py-3 px-3 border-b text-[12px]"
        >
          {/* Descripción */}
          <div className="col-span-2 font-medium leading-tight">
            {item.description}
          </div>

          {/* Inventarios */}
          <div className="text-center text-gray-700">
            {item.inventarioSala}/{item.inventarioDeposito}/
            {item.inventarioFrio}
          </div>

          {/* Precio */}
          <div className="text-center font-bold text-primary">
            S/ {item.precio.toFixed(2)}
          </div>

          {/* Acciones */}
          <div className="flex justify-center gap-3">
            <button
              type="button"
              className="text-blue-600 hover:text-blue-800 cursor-pointer"
              onClick={() => setEditIndex(index)}
              aria-label="Editar elemento"
            >
              <Pencil className="w-4 h-4" />
            </button>

            <button
              type="button"
              className="text-red-600 hover:text-red-800 cursor-pointer"
              onClick={() => setDeleteIndex(index)}
              aria-label="Eliminar elemento"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Modales */}
          {editIndex === index && (
            <CartEditModal index={index} onClose={() => setEditIndex(null)} />
          )}

          {deleteIndex === index && (
            <ConfirmDeleteModal
              index={index}
              onClose={() => setDeleteIndex(null)}
            />
          )}
        </div>
      ))}
    </div>
  );
}
