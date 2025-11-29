// components/cart-list.tsx
"use client";

import { useCart } from "@/contexts/cart-context";
import { Trash } from "lucide-react";

export default function CartList() {
  const { items, removeItem } = useCart();

  if (items.length === 0)
    return <p className="text-center text-gray-500">No has agregado productos.</p>;

  return (
    <div className="mt-8 space-y-4">
      {items.map((item, i) => (
        <div
          key={i}
          className="p-4 rounded-lg border shadow-sm bg-white flex flex-col"
        >
          <h4 className="font-semibold">{item.description}</h4>

          <p className="text-sm text-gray-600 mt-1">
            Sala: {item.inventarioSala} • Depósito: {item.inventarioDeposito} •
            Frío: {item.inventarioFrio}
          </p>

          <p className="mt-2 font-bold text-primary">
            S/ {item.precio.toFixed(2)}
          </p>

          <button
            onClick={() => removeItem(i)}
            className="mt-3 text-red-600 flex items-center gap-2 cursor-pointer"
          >
            <Trash className="w-4 h-4" />
            Eliminar
          </button>
        </div>
      ))}
    </div>
  );
}
