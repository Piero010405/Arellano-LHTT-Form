"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FormField from "@/components/form-field";
import { useSubmitAlternativa } from "@/hooks/useSubmitAlternativa";
import ArellanoLoader from "@/components/arellano-loader";
import { useToast } from "@/components/ui/use-toast";
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
  onSubmit?: (data: FormData) => void;
  onSuccess: (registroId: string) => void;
}

export default function ArellanoForm({ onSuccess }: ArellanoFormProps) {
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const { submitAlternativa, loading } = useSubmitAlternativa();
  const { toast } = useToast();

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

  const { results: productResults, loading: loadingProducts } =
    useProductSearch(formData.busqueda);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // ------------------------------
  // 🔍 Scroll al primer campo con error
  // ------------------------------
  const scrollToFirstError = (errorMap: Record<string, string>) => {
    const order = [
      "cluster",
      "email",
      "codigo",
      "busqueda",
      "nankey",
      "inventarioSala",
      "inventarioDeposito",
      "inventarioFrio",
      "precio",
    ];

    const firstKey = order.find((k) => errorMap[k]);
    if (!firstKey) return;

    const el = document.querySelector<HTMLElement>(`[name="${firstKey}"]`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      (el as HTMLInputElement | HTMLSelectElement).focus();
    }
  };

  // ------------------------------
  // AUTOCOMPLETE / NANKEY
  // ------------------------------
  useEffect(() => {
    if (formData.busqueda.trim().length === 0) {
      setFormData((prev) => ({ ...prev, nankey: "" }));
    }

    setDropdownOpen(formData.busqueda.length >= 2);
  }, [formData.busqueda]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ------------------------------
  // VALIDACIÓN FRONT
  // ------------------------------
  const validateForm = (): Record<string, string> => {
    const newErrors: Record<string, string> = {};

    if (!formData.cluster) newErrors.cluster = "Este campo es obligatorio";

    if (!formData.email) {
      newErrors.email = "Este campo es obligatorio";
    } else if (!formData.email.endsWith("@arellano.pe")) {
      newErrors.email = "El correo debe terminar en @arellano.pe";
    }

    if (!formData.codigo) newErrors.codigo = "Este campo es obligatorio";

    if (!formData.busqueda) {
      newErrors.busqueda = "Este campo es obligatorio";
    } else if (!formData.nankey) {
      newErrors.nankey = "Debes seleccionar un producto de la lista";
    }

    if (!formData.precio) newErrors.precio = "Este campo es obligatorio";

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
    return newErrors;
  };

  // ------------------------------
  // HANDLE CHANGE
  // ------------------------------
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
      if (value.length >= 2) {
        setDropdownOpen(true);
      } else {
        setDropdownOpen(false);
      }
    }
  };

  // ------------------------------
  // HANDLE SUBMIT
  // ------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const frontErrors = validateForm();
    if (Object.keys(frontErrors).length > 0) {
      scrollToFirstError(frontErrors);
      return;
    }

    const payload = {
      cluster: formData.cluster,
      correoArellano: formData.email,
      codigoAlternativa: Number(formData.codigo),
      productDesc: formData.busqueda.trim(),
      nankey: Number(formData.nankey),
      inventarioSala: formData.inventarioSala
        ? Number(formData.inventarioSala)
        : null,
      inventarioDeposito: formData.inventarioDeposito
        ? Number(formData.inventarioDeposito)
        : null,
      inventarioFrio: formData.inventarioFrio
        ? Number(formData.inventarioFrio)
        : null,
      precio: parseFloat(formData.precio)
    };

    const result = await submitAlternativa(payload);

    // ❌ ERROR DESDE EL BACKEND (ZOD / OTROS)
    if (!result.success) {
      const fe = result.fieldErrors;

      if (fe && Object.keys(fe).length > 0) {
        const mapped: Record<string, string> = {};

        if (fe.correoArellano) mapped.email = fe.correoArellano[0];
        if (fe.codigoAlternativa) mapped.codigo = fe.codigoAlternativa[0];
        if (fe.productDesc) mapped.busqueda = fe.productDesc[0];
        if (fe.nankey) mapped.nankey = fe.nankey[0];
        if (fe.precio) mapped.precio = fe.precio[0];

        setErrors(mapped);
        scrollToFirstError(mapped);
        return;
      }

      toast({
        title: "Error al enviar",
        description: result.message,
        variant: "destructive",
      });

      return;
    }

    onSuccess(result.registroId!);
  };

  // ------------------------------
  // RENDER
  // ------------------------------
  return (
    <div className="min-h-screen bg-linear-to-b from-background to-slate-50 py-8 px-4 md:py-12">
      <div className="max-w-2xl mx-auto">
        {/* HEADER */}
        <div className="mb-8 text-center">
          <div className="mb-4 h-16 bg-primary rounded-lg flex items-center justify-center border-2 border-primary">
            <span className="text-white text-lg font-bold tracking-wider">
              Arellano | Auditoria
            </span>
          </div>
          <h1 className="text-4xl font-bold text-primary mb-2">
            Formulario LHTT
          </h1>
          <p className="text-muted-foreground">
            Alternativas de Gestión de Contratos
          </p>
        </div>

        {loading && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <ArellanoLoader />
          </div>
        )}

        <Card className="shadow-lg border border-border">
          <div className="bg-primary text-primary-foreground px-6 py-4 rounded-t-lg">
            <h2 className="text-2xl font-semibold">Registro de Alternativas</h2>
          </div>

          <CardContent className="pt-8">
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
              autoComplete="off"
            >
              {/* INFORMACIÓN GENERAL */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">
                  Información General
                </h3>

                <div className="pl-4 border-l-4 border-primary space-y-4">
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
                      className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md bg-white text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primarytransition-all"
                    >
                      <option value="">Selecciona un cluster</option>
                      <option value="Cluster Norte">Cluster Norte</option>
                      <option value="Cluster Centro">Cluster Centro</option>
                      <option value="Cluster Sur">Cluster Sur</option>
                    </select>
                  </FormField>

                  <FormField
                    label="CORREO ARELLANO"
                    name="email"
                    required
                    type="email"
                    placeholder="correo@arellano.pe"
                    icon={<Mail className="w-5 h-5" />}
                    error={errors.email}
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* DATOS DEL PRODUCTO */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">
                  Datos del Producto
                </h3>

                <div className="pl-4 border-l-4 border-primary space-y-4">
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
                                setFormData((prev) => ({
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
                    error={errors.nankey}
                  />
                </div>
              </div>

              {/* INVENTARIOS */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">
                  Niveles de Inventario
                </h3>

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
                  className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105 cursor-pointer"
                >
                  Enviar Formulario
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
