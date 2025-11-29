// components/cart-edit-modal.tsx
"use client";

import { useState } from "react";
import { useCart } from "@/contexts/cart-context";
import { X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Props {
  index: number;
  onClose: () => void;
}

export default function CartEditModal({ index, onClose }: Props) {
  const { items, updateItem } = useCart();
  const { toast } = useToast();

  const item = items[index];

  const [form, setForm] = useState({
    inventarioSala: item.inventarioSala.toString(),
    inventarioDeposito: item.inventarioDeposito.toString(),
    inventarioFrio: item.inventarioFrio.toString(),
    precio: item.precio.toString(),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // -------------------------------
  // VALIDACIONES
  // -------------------------------
  const validate = () => {
    const newErrors: Record<string, string> = {};

    // Campos vacíos
    if (form.inventarioSala.trim() === "")
      newErrors.inventarioSala = "Campo obligatorio";

    if (form.inventarioDeposito.trim() === "")
      newErrors.inventarioDeposito = "Campo obligatorio";

    if (form.inventarioFrio.trim() === "")
      newErrors.inventarioFrio = "Campo obligatorio";

    // Validar precio
    const precio = Number(form.precio);
    if (form.precio.trim() === "") newErrors.precio = "Campo obligatorio";
    else if (isNaN(precio) || precio <= 0)
      newErrors.precio = "El precio debe ser mayor a 0";

    // Validación de "al menos un inventario"
    const sala = Number(form.inventarioSala) || 0;
    const dep = Number(form.inventarioDeposito) || 0;
    const frio = Number(form.inventarioFrio) || 0;

    if (sala === 0 && dep === 0 && frio === 0) {
      newErrors.inventarioFrio =
        "Debe haber al menos un inventario mayor a cero";
      newErrors.inventarioDeposito = " ";
      newErrors.inventarioSala = " ";
    }

    setErrors(newErrors);
    return newErrors;
  };

  const handleEdit = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) return;

    updateItem(index, {
      ...item,
      inventarioSala: Number(form.inventarioSala),
      inventarioDeposito: Number(form.inventarioDeposito),
      inventarioFrio: Number(form.inventarioFrio),
      precio: Number(form.precio),
    });

    toast({
      title: "Producto actualizado",
      description: "Los cambios fueron guardados correctamente",
    });

    onClose();
  };

  // Helper: remover flechitas del input number
  const numberInputClass =
    "w-full border rounded px-3 py-2 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-80 shadow-xl relative">

        {/* TITULO CON EL PRODUCTO */}
        <h3 className="text-lg font-semibold mb-4 text-primary leading-tight">
          Editar Producto
        </h3>

        <p className="text-sm text-gray-700 mb-4 font-medium">
          {item.description}
        </p>

        {/* FORM FIELDS */}
        <div className="space-y-4 mb-2">

          {/* INVENTARIO SALA */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Inventario en Sala
            </label>

            <input
              type="number"
              min={0}
              placeholder="0"
              value={form.inventarioSala}
              onChange={(e) =>
                setForm({ ...form, inventarioSala: e.target.value })
              }
              className={`${numberInputClass} ${
                errors.inventarioSala ? "border-red-500" : "border-gray-300"
              }`}
            />

            {errors.inventarioSala && (
              <p className="text-red-500 text-xs mt-1">{errors.inventarioSala}</p>
            )}
          </div>

          {/* INVENTARIO DEPÓSITO */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Inventario en Depósito
            </label>

            <input
              type="number"
              min={0}
              placeholder="0"
              value={form.inventarioDeposito}
              onChange={(e) =>
                setForm({ ...form, inventarioDeposito: e.target.value })
              }
              className={`${numberInputClass} ${
                errors.inventarioDeposito ? "border-red-500" : "border-gray-300"
              }`}
            />

            {errors.inventarioDeposito && (
              <p className="text-red-500 text-xs mt-1">
                {errors.inventarioDeposito}
              </p>
            )}
          </div>

          {/* INVENTARIO FRIO */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Inventario en Frío
            </label>

            <input
              type="number"
              min={0}
              placeholder="0"
              value={form.inventarioFrio}
              onChange={(e) =>
                setForm({ ...form, inventarioFrio: e.target.value })
              }
              className={`${numberInputClass} ${
                errors.inventarioFrio ? "border-red-500" : "border-gray-300"
              }`}
            />

            {errors.inventarioFrio && (
              <p className="text-red-500 text-xs mt-1">
                {errors.inventarioFrio}
              </p>
            )}
          </div>

          {/* PRECIO */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Precio (S/.)
            </label>

            <input
              type="number"
              min={0.01}
              step="0.01"
              placeholder="0.00"
              value={form.precio}
              onChange={(e) => setForm({ ...form, precio: e.target.value })}
              className={`${numberInputClass} ${
                errors.precio ? "border-red-500" : "border-gray-300"
              }`}
            />

            {errors.precio && (
              <p className="text-red-500 text-xs mt-1">{errors.precio}</p>
            )}
          </div>

        </div>

        {/* ACTION BUTTONS */}
        <button
        type="button"
        className="px-3 py-2 text-sm bg-gray-200 rounded cursor-pointer mr-3"
        onClick={onClose}
        >
        Cancelar
        </button>

        <button
        type="button"
        className="px-3 py-2 text-sm bg-primary text-white rounded cursor-pointer"
        onClick={handleEdit}
        >
        Guardar cambios
        </button>

        <button
        type="button"
        className="absolute right-3 top-3 text-gray-600 cursor-pointer"
        onClick={onClose}
        aria-label="Cerrar modal"
        >
        <X className="w-5 h-5" />
        </button>

      </div>
    </div>
  );
}
