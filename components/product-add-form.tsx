// components/product-add-form.tsx
"use client";

import { useState } from "react";
import { useCart } from "@/contexts/cart-context";
import { useToast } from "@/components/ui/use-toast";
import {
  Search,
  Lock,
  Package,
  Warehouse,
  Snowflake,
  DollarSign,
} from "lucide-react";
import FormField from "./form-field";

interface ProductAddFormProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  productResults: { productId: number; description: string }[];
  dropdownOpen: boolean;
  loadingProducts: boolean;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  setDropdownOpen: (open: boolean) => void;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  errors: Record<string, string>;
}

export default function ProductAddForm({
  formData,
  setFormData,
  productResults,
  dropdownOpen,
  loadingProducts,
  dropdownRef,
  setDropdownOpen,
  handleChange,
  errors,
}: ProductAddFormProps) {
  const { addItem } = useCart();
  const { toast } = useToast();

  const [itemErrors, setItemErrors] = useState<Record<string, string>>({});

  const validateItem = () => {
    const errs: Record<string, string> = {};

    if (!formData.busqueda || !formData.nankey)
      errs.busqueda = "Debes seleccionar un producto";

    const invSala = Number(formData.inventarioSala) || 0;
    const invDep = Number(formData.inventarioDeposito) || 0;
    const invFrio = Number(formData.inventarioFrio) || 0;

    if (invSala === 0 && invDep === 0 && invFrio === 0)
      errs.inventarios = "Al menos uno de los campos de inventario debe tener un valor.";

    if (!formData.precio || Number(formData.precio) <= 0)
      errs.precio = "Precio inválido";

    setItemErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAdd = () => {
    if (!validateItem()) {
      toast({
        title: "Error",
        description: "Revisa los campos del producto",
        variant: "destructive",
      });
      return;
    }

    addItem({
      nankey: Number(formData.nankey),
      description: formData.busqueda,
      inventarioSala: Number(formData.inventarioSala) || 0,
      inventarioDeposito: Number(formData.inventarioDeposito) || 0,
      inventarioFrio: Number(formData.inventarioFrio) || 0,
      precio: Number(formData.precio),
    });

    // limpiar errores globales
    setItemErrors({});
    
    // borra error global de items
    if (errors.items) {
      errors.items = "";
    }

    // limpiar formulario
    setFormData((p: any) => ({
      ...p,
      busqueda: "",
      nankey: "",
      inventarioSala: "",
      inventarioDeposito: "",
      inventarioFrio: "",
      precio: "",
    }));

    toast({ title: "Producto agregado", description: "Se añadió al listado" });
  };

  return (
    <>
      {/* DATOS DEL PRODUCTO */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-primary">Datos del Producto</h3>

        <div className="pl-4 border-l-4 border-primary space-y-4">
            <div className="relative">
                <FormField
                    label="BUSQUEDA POR (DESCRIPCIÓN DEL PRODUCTO)"
                    name="busqueda"
                    required
                    type="text"
                    placeholder="Descripción del producto"
                    icon={<Search className="w-5 h-5" />}
                    error={errors.busqueda}
                    value={formData.busqueda}
                    onChange={handleChange}
                />

                {dropdownOpen && (
                <div
                    ref={dropdownRef}
                    className="absolute z-50 w-full bg-white border border-gray-300 rounded-md shadow-md mt-1 max-h-48 overflow-auto"
                >
                    {loadingProducts ? (
                        <div className="px-3 py-2 text-sm text-gray-500 animate-pulse">
                            Buscando...
                        </div>
                        ) : productResults.length === 0 ? (
                        <div className="px-3 py-2 text-sm text-gray-500">
                            No se encontraron resultados
                        </div>
                        ) : (
                          productResults.map((item) => (
                            <div
                              key={item.productId}
                              onClick={() => {
                                setFormData((prev: any) => ({
                                  ...prev,
                                  busqueda: item.description,
                                  nankey: String(item.productId),
                                }));
                                setDropdownOpen(false);
                                setTimeout(() => setDropdownOpen(false), 0);
                              }}
                              className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                            >
                              {item.description}
                            </div>
                          ))
                        )}
                </div>
                )}
            </div>

          <FormField
            label="NANKEY"
            name="nankey"
            type="text"
            disabled
            icon={<Lock className="w-5 h-5" />}
            value={formData.nankey}
            error={itemErrors.nankey}
          />
        </div>
      </div>

      {/* INVENTARIOS */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-primary">
          Niveles de Inventario
        </h3>

        <div className="pl-4 border-l-4 border-primary space-y-4">
          {itemErrors.inventarios && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
              🛑 {itemErrors.inventarios}
            </div>
          )}

          <FormField
            label="INVENTARIO EN SALA"
            name="inventarioSala"
            type="number"
            placeholder="0"
            icon={<Package className="w-5 h-5" />}
            value={formData.inventarioSala}
            onChange={handleChange}
          />

          <FormField
            label="INVENTARIO EN DEPÓSITO"
            name="inventarioDeposito"
            type="number"
            placeholder="0"
            icon={<Warehouse className="w-5 h-5" />}
            value={formData.inventarioDeposito}
            onChange={handleChange}
          />

          <FormField
            label="INVENTARIO EN FRÍO"
            name="inventarioFrio"
            type="number"
            placeholder="0"
            icon={<Snowflake className="w-5 h-5" />}
            value={formData.inventarioFrio}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* PRECIO */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-primary">Precio</h3>

        <div className="pl-4 border-l-4 border-primary space-y-4">
          <FormField
            label="PRECIO"
            name="precio"
            required
            type="number"
            step="0.01"
            placeholder="0.00"
            icon={<DollarSign className="w-5 h-5" />}
            error={itemErrors.precio}
            value={formData.precio}
            onChange={handleChange}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={handleAdd}
        className="w-full bg-primary text-white py-3 rounded-lg cursor-pointer"
      >
        Agregar producto
      </button>
    </>
  );
}
