// components/arellano-form.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FormField from "@/components/form-field";
import ArellanoLoader from "@/components/arellano-loader";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/contexts/cart-context";

import {
  MapPin,
  Mail,
  Hash,
} from "lucide-react";

import ProductAddForm from "@/components/product-add-form";
import CartList from "@/components/cart-list";

import { useProductSearch } from "@/hooks/useProductSearch";
import { useSubmitAlternativa } from "@/hooks/useSubmitAlternativa";

// ---------------------------
// Types
// ---------------------------
interface FormData {
  cluster: string;
  email: string;
  codigo: string;

  // dinámicos para item
  busqueda: string;
  nankey: string;
  inventarioSala: string;
  inventarioDeposito: string;
  inventarioFrio: string;
  precio: string;
}

interface ArellanoFormProps {
  onSuccess: (registroId: string) => void;
}

// ---------------------------
// Component
// ---------------------------
export default function ArellanoForm({ onSuccess }: ArellanoFormProps) {
  const { toast } = useToast();
  const { items, clear } = useCart();

  // ref PERMITE NULL
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const { submitAlternativa, loading } = useSubmitAlternativa();

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

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // AUTOCOMPLETE API
  const { results: productResults, loading: loadingProducts } =
    useProductSearch(formData.busqueda);

  // ---------------------------
  // Scroll to first error
  // ---------------------------
  const scrollToFirstError = (errObj: Record<string, string>) => {
    const order = ["cluster", "email", "codigo"];
    const firstErrorKey = order.find((k) => errObj[k]);

    if (!firstErrorKey) return;

    const el = document.querySelector<HTMLElement>(`[name="${firstErrorKey}"]`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.focus();
    }
  };

  // ---------------------------
  // AUTOCOMPLETE / NANKEY
  // ---------------------------
  useEffect(() => {
    if (formData.busqueda.trim().length === 0) {
      setFormData((prev) => ({ ...prev, nankey: "" }));
    }

    setDropdownOpen(formData.busqueda.length >= 2);
  }, [formData.busqueda]);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ---------------------------
  // HANDLE CHANGE
  // ---------------------------
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (name === "busqueda") {
      if (value.length >= 2) setDropdownOpen(true);
      else setDropdownOpen(false);
    }
  };

  // ---------------------------
  // VALIDACIÓN GENERAL
  // ---------------------------
  const validateGeneral = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.cluster) newErrors.cluster = "Campo obligatorio";
    if (!formData.codigo) newErrors.codigo = "Campo obligatorio";

    if (!formData.email)
      newErrors.email = "Campo obligatorio";
    else if (!formData.email.endsWith("@arellano.pe"))
      newErrors.email = "Debe terminar en @arellano.pe";

    if (items.length === 0)
      newErrors.items = "Debe agregar al menos 1 producto";

    setErrors(newErrors);
    return newErrors;
  };

  // ---------------------------
  // SUBMIT → ENVÍA TODOS LOS ITEMS
  // ---------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const frontErrors = validateGeneral();

    if (Object.keys(frontErrors).length > 0) {
      scrollToFirstError(frontErrors); // 👉 SCROLL ACTIVADO
      toast({
        title: "Formulario incompleto",
        description: "Revisa los campos marcados en rojo",
        variant: "destructive",
      });
      return;
    }

    // Enviar uno por uno
    for (const item of items) {
      const payload = {
        cluster: formData.cluster,
        correoArellano: formData.email,
        codigoAlternativa: Number(formData.codigo),
        productDesc: item.description,
        nankey: item.nankey,
        inventarioSala: item.inventarioSala,
        inventarioDeposito: item.inventarioDeposito,
        inventarioFrio: item.inventarioFrio,
        precio: item.precio,
      };

      const result = await submitAlternativa(payload);

      if (!result.success) {
        toast({
          title: "Error",
          description: "Un producto no pudo enviarse",
          variant: "destructive",
        });
        return;
      }
    }

    clear();
    onSuccess(`${formData.codigo}-${Date.now()}`);
  };

  // ---------------------------
  // RENDER
  // ---------------------------
  return (
    <div className="min-h-screen bg-linear-to-b from-background to-slate-50 py-8 px-4 md:py-12">
      <div className="max-w-2xl mx-auto">

        {/* ---- HEADER ---- */}
        <div className="mb-8 text-center">
          <div className="mb-4 h-16 bg-primary rounded-lg flex items-center justify-center border-2 border-primary">
            <span className="text-white text-lg font-bold tracking-wider">
              Arellano | Auditoria
            </span>
          </div>
          <h1 className="text-4xl font-bold text-primary mb-2">Formulario LHTT</h1>
          <p className="text-muted-foreground">
            Alternativas de Gestión de Contratos
          </p>
        </div>

        {/* LOADER */}
        {loading && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <ArellanoLoader />
          </div>
        )}

        {/* CARD */}
        <Card className="shadow-lg border border-border">
          <div className="bg-primary text-primary-foreground px-6 py-4 rounded-t-lg">
            <h2 className="text-2xl font-semibold">Registro de Alternativas</h2>
          </div>

          <CardContent className="pt-8">
            <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">

              {/* ------------------------- */}
              {/* INFORMACIÓN GENERAL */}
              {/* ------------------------- */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">Información General</h3>

                <div className="pl-4 border-l-4 border-primary space-y-4">

                  {/* CLUSTER */}
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

                  {/* EMAIL */}
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

                  {/* CÓDIGO */}
                  <FormField
                    label="CÓDIGO DE ALTERNATIVA"
                    name="codigo"
                    required
                    type="number"
                    placeholder="Ej: 12345"
                    icon={<Hash className="w-5 h-5" />}
                    error={errors.codigo}
                    value={formData.codigo}
                    onChange={handleChange}
                  />

                </div>
              </div>

              {/* AGREGAR PRODUCTO */}
              <ProductAddForm
                formData={formData}
                setFormData={setFormData}
                productResults={productResults}
                dropdownOpen={dropdownOpen}
                loadingProducts={loadingProducts}
                dropdownRef={dropdownRef}
                setDropdownOpen={setDropdownOpen}
                handleChange={handleChange}
                errors={errors}
              />

              {/* LISTA DEL CARRITO */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-primary">Productos agregados</h3>

                {errors.items && (
                  <p className="text-red-500 text-sm mb-2">{errors.items}</p>
                )}

                <CartList />
              </div>

              {/* BOTON FINAL */}
              <div className="pt-6">
                <Button
                  type="submit"
                  className="w-full bg-secondary text-secondary-foreground font-semibold py-3 rounded-lg cursor-pointer"
                >
                  Enviar todos los productos
                </Button>
              </div>

            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
