// components/confirm-delete-modal.tsx
"use client";

import { useCart } from "@/contexts/cart-context";
import { X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Props {
  index: number;
  onClose: () => void;
}

export default function ConfirmDeleteModal({ index, onClose }: Props) {
  const { removeItem } = useCart();
  const { toast } = useToast();

  const handleDelete = () => {
    removeItem(index);
    toast({
      title: "Producto eliminado",
      variant: "destructive",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-80 shadow-xl relative">

        <h3 className="text-lg font-semibold text-primary mb-4">
          Eliminar producto
        </h3>

        <p className="text-sm text-gray-700 mb-6">
          ¿Estás seguro de que deseas eliminar este producto del listado?
        </p>

        <div className="flex justify-end gap-3">
          <button className="px-3 py-2 bg-gray-200 rounded cursor-pointer" type="button" onClick={onClose}>
            Cancelar
          </button>

          <button
            type="button"
            className="px-3 py-2 bg-red-600 text-white rounded cursor-pointer"
            onClick={handleDelete}
          >
            Eliminar
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-600 cursor-pointer"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

      </div>
    </div>
  );
}
