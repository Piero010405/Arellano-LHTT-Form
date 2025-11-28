"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FormField from "@/components/form-field";
import {
  MapPin,
  Mail,
  Hash,
  Search,
  Lock,
  Package,
  Warehouse,
  Snowflake,
  DollarSign,
} from "lucide-react";
import { useProductSearch } from "@/hooks/useProductSearch";

interface FormData {
  cluster: string;
  email: string;
  codigo: string;
  busqueda: string;
  nankey: string;
  inventarioSala: string;
  inventarioDeposito: string;
  inventarioFrio: string;
  precio: string;
}

interface ArellanoFormProps {
  onSubmit: (data: FormData) => void;
}

export default function ArellanoForm({ onSubmit }: ArellanoFormProps) {
  const [formData, setFormData] = useState<FormData>({
    cluster: "",
    email: "",
    codigo: "",
    busqueda: "",
    nankey: "",
    inventarioSala: "",
    inventarioDeposito: "",
    inventarioFrio: "",
    precio: "",
  });

  const { results: productResults } = useProductSearch(formData.busqueda);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    // Si se borra toda la descripción → resetear nankey
    if (formData.busqueda.trim().length === 0) {
      setFormData((prev) => ({ ...prev, nankey: "" }));
    }

    // Abrir/cerrar dropdown según longitud
    setDropdownOpen(formData.busqueda.length >= 2);
  }, [formData.busqueda]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.cluster) newErrors.cluster = "Este campo es obligatorio";

    if (!formData.email) {
      newErrors.email = "Este campo es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Ingresa un correo válido";
    }

    if (!formData.codigo) newErrors.codigo = "Este campo es obligatorio";
    if (!formData.busqueda) newErrors.busqueda = "Este campo es obligatorio";
    if (!formData.precio) newErrors.precio = "Este campo es obligatorio";

    // Inventarios
    const inv = [
      Number(formData.inventarioSala) || 0,
      Number(formData.inventarioDeposito) || 0,
      Number(formData.inventarioFrio) || 0,
    ];

    if (!inv.some((v) => v > 0)) {
      newErrors.inventoryWarning =
        "Al menos uno de los campos de inventario debe tener un valor.";
    }

    const precioNum = Number(formData.precio);
    if (precioNum <= 0) newErrors.precio = "El precio debe ser mayor a cero";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    if (name === "busqueda") {
      // Solo abrir si el usuario está escribiendo
      if (value.length >= 2) {
        setDropdownOpen(true);
      } else {
        setDropdownOpen(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      setTimeout(() => {
        onSubmit(formData);
        setIsSubmitting(false);
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-slate-50 py-8 px-4 md:py-12">
      <div className="max-w-2xl mx-auto">

        {/* HEADER */}
        <div className="mb-8 text-center">
          <div className="mb-4 h-16 bg-primary rounded-lg flex items-center justify-center border-2 border-primary">
            <span className="text-white text-lg font-bold tracking-wider">
              ARELLANO
            </span>
          </div>
          <h1 className="text-4xl font-bold text-primary mb-2">
            Formulario LHTT
          </h1>
          <p className="text-muted-foreground">Alternativas de Gestión</p>
        </div>

        {/* CARD */}
        <Card className="shadow-lg border border-border">
          <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
            <CardTitle className="text-2xl">Registro de Alternativas</CardTitle>
          </CardHeader>

          <CardContent className="pt-8">
            <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">

              {/* INFORMACIÓN GENERAL */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">Información General</h3>

                <div className="pl-4 border-l-4 border-primary space-y-4">

                  {/* SELECT CLUSTER (ACCESIBLE CORRECTAMENTE) */}
                  <FormField
                    label="CLUSTER"
                    required
                    icon={<MapPin className="w-5 h-5" />}
                    error={errors.cluster}
                  >
                    <select
                      name="cluster"
                      id="cluster"
                      aria-label="Cluster"
                      value={formData.cluster}
                      onChange={handleChange}
                      className="w-full px-4 py-2 pl-10 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                    >
                      <option value="">Selecciona un cluster</option>
                      <option value="Cluster Norte">Cluster Norte</option>
                      <option value="Cluster Centro">Cluster Centro</option>
                      <option value="Cluster Sur">Cluster Sur</option>
                    </select>
                  </FormField>

                  {/* CORREO */}
                  <FormField
                    label="CORREO ARELLANO"
                    name="email"
                    required
                    type="email"
                    placeholder="correo@arellano.com"
                    icon={<Mail className="w-5 h-5" />}
                    error={errors.email}
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* DATOS DEL PRODUCTO */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">Datos del Producto</h3>

                <div className="pl-4 border-l-4 border-primary space-y-4">

                  {/* CÓDIGO */}
                  <FormField
                    label="CODIGO DE ALTERNATIVA"
                    name="codigo"
                    required
                    type="number"
                    placeholder="Ej: 12345"
                    icon={<Hash className="w-5 h-5" />}
                    error={errors.codigo}
                    value={formData.codigo}
                    onChange={handleChange}
                  />

                  {/* BUSQUEDA + AUTOCOMPLETE */}
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

                    {dropdownOpen &&
                      productResults.length > 0 &&
                      formData.busqueda.length >= 2 && (
                        <div className="absolute z-50 w-full bg-white border border-gray-300 rounded-md shadow-md mt-1 max-h-48 overflow-auto">
                          {productResults.map((item) => (
                            <div
                              key={item.productId}
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  busqueda: item.description,
                                  nankey: String(item.productId),
                                }));

                                // Cerrar dropdown correctamente
                                setDropdownOpen(false);

                                // Evitar que se reabra automáticamente
                                setTimeout(() => {
                                  setDropdownOpen(false);
                                }, 0);
                              }}
                              className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                            >
                              {item.description}
                            </div>
                          ))}
                        </div>
                      )}
                  </div>

                  {/* NANKEY */}
                  <FormField
                    label="NANKEY"
                    name="nankey"
                    type="text"
                    disabled
                    icon={<Lock className="w-5 h-5" />}
                    value={formData.nankey}
                  />
                </div>
              </div>

              {/* INVENTARIOS */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">Niveles de Inventario</h3>

                <div className="pl-4 border-l-4 border-primary space-y-4">
                  {errors.inventoryWarning && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                      🛑 {errors.inventoryWarning}
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
                    error={errors.precio}
                    value={formData.precio}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* BOTÓN */}
              <div className="pt-8">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
                >
                  {isSubmitting ? "Enviando..." : "Enviar Formulario"}
                </Button>
              </div>

            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
