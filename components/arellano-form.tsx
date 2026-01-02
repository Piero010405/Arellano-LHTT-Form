// components/arellano-form.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FormField from "@/components/form-field";
import ArellanoLoader from "@/components/arellano-loader";
import ConfirmSubmitModal from "@/components/confirm-submit-modal";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/contexts/cart-context";
import { useGeneralForm } from "@/contexts/general-form-context";
import { useAuditorAutocomplete } from "@/hooks/useAuditorAutocomplete";

import {
  MapPin,
  Mail,
  Hash,
} from "lucide-react";

import ProductAddForm from "@/components/product-add-form";
import CartList from "@/components/cart-list";

import { useProductSearch } from "@/hooks/useProductSearch";
import { useSubmitAlternativa } from "@/hooks/useSubmitAlternativa";

interface ItemFormData {
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

export default function ArellanoForm({ onSuccess }: ArellanoFormProps) {
  const { toast } = useToast();
  const { items, clear } = useCart();
  const { general, setGeneral, clearGeneral } = useGeneralForm();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const { results: auditorResults, matchedAuditor } =
  useAuditorAutocomplete(general.email);
  const [auditorOpen, setAuditorOpen] = useState(false);
  const auditorRef = useRef<HTMLDivElement | null>(null);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const { submitAlternativa, loading } = useSubmitAlternativa();

  // Estado solo de los campos dinámicos del item
  const [formData, setFormData] = useState<ItemFormData>({
    busqueda: "",
    nankey: "",
    inventarioSala: "",
    inventarioDeposito: "",
    inventarioFrio: "",
    precio: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { results: productResults, loading: loadingProducts } =
    useProductSearch(formData.busqueda);

  // -----------------------------------------
  // SCROLL TO FIRST ERROR
  // -----------------------------------------
  const scrollToFirstError = (errorMap: Record<string, string>) => {
    const order = ["cluster", "email", "codigo"];
    const firstKey = order.find((k) => errorMap[k]);

    if (!firstKey) return;

    const el = document.querySelector<HTMLElement>(`[name="${firstKey}"]`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.focus();
    }
  };

  // -----------------------------------------
  // AUTOCOMPLETE LOGIC
  // -----------------------------------------
  useEffect(() => {
    if (formData.busqueda.trim() === "") {
      setFormData((prev) => ({ ...prev, nankey: "" }));
    }
    setDropdownOpen(formData.busqueda.length >= 2);
  }, [formData.busqueda]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // -----------------------------------------
  // AUTO-OPEN AUDITOR DROPDOWN
  // -----------------------------------------
  useEffect(() => {
    if (matchedAuditor) {
      setAuditorOpen(false);
    }
  }, [matchedAuditor]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        auditorRef.current &&
        !auditorRef.current.contains(e.target as Node)
      ) {
        setAuditorOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // -----------------------------------------
  // HANDLE CHANGE (context + local)
  // -----------------------------------------
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Campos globales → cluster / email / codigo
    if (["cluster", "email", "codigo"].includes(name)) {
      setGeneral((prev) => ({ ...prev, [name]: value }));
    } else {
      // Campos de producto
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (name === "busqueda") {
      setDropdownOpen(value.length >= 2);
    }

    if (name === "email") {
      setAuditorOpen(value.trim().length >= 2);
    }
  };

  // -----------------------------------------
  // VALIDACIÓN GENERAL (solo campos globales + carrito)
  // -----------------------------------------
  const validateGeneral = () => {
    const newErrors: Record<string, string> = {};

    if (!general.cluster) newErrors.cluster = "Campo obligatorio";

    if (!general.email) newErrors.email = "Campo obligatorio";
    else if (!general.email.endsWith("@arellano.pe"))
      newErrors.email = "Debe terminar en @arellano.pe";

    if (!general.codigo) newErrors.codigo = "Campo obligatorio";

    if (items.length === 0)
      newErrors.items = "Debe agregar al menos 1 producto";

    setErrors(newErrors);
    return newErrors;
  };

  // -----------------------------------------
  // SUBMIT → ENVÍA TODO EL CARRITO
  // -----------------------------------------
  const submitAllItems = async () => {
    for (const item of items) {
      const payload = {
        cluster: general.cluster,
        correoArellano: general.email,
        codigoAlternativa: Number(general.codigo),
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

    // Reset total
    clear();
    clearGeneral();
    setFormData({
      busqueda: "",
      nankey: "",
      inventarioSala: "",
      inventarioDeposito: "",
      inventarioFrio: "",
      precio: "",
    });

    setShowConfirmModal(false);
    onSuccess(`${general.codigo}-${Date.now()}`);
  };

  // -----------------------------------------
  // RENDER
  // -----------------------------------------
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
          <h1 className="text-4xl font-bold text-primary mb-2">Formulario LHTT</h1>
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
            <form className="space-y-6" autoComplete="off">
              
              {/* INFORMACION GENERAL */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">Información General</h3>

                <div className="pl-4 border-l-4 border-primary space-y-4">

                  <FormField
                    label="CLUSTER"
                    required
                    icon={<MapPin className="w-5 h-5" />}
                    error={errors.cluster}
                  >
                    <select
                      name="cluster"
                      aria-label="Cluster"
                      value={general.cluster}
                      onChange={handleChange}
                      className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md bg-white"
                    >
                      <option value="">Selecciona un cluster</option>
                      <option value="Cluster Norte">Cluster Norte</option>
                      <option value="Cluster Centro">Cluster Centro</option>
                      <option value="Cluster Sur">Cluster Sur</option>
                    </select>
                  </FormField>

                  <div className="relative" ref={auditorRef}>
                    <FormField
                      label="CORREO ARELLANO"
                      name="email"
                      required
                      type="email"
                      placeholder="correo@arellano.pe"
                      icon={<Mail className="w-5 h-5" />}
                      error={errors.email}
                      value={general.email}
                      onChange={handleChange}
                    />

                    {auditorOpen && auditorResults.length > 0 && !matchedAuditor && (
                      <div className="absolute left-0 top-full mt-1 w-full bg-white border rounded-md shadow-lg z-30">
                        {auditorResults.map((a) => (
                          <button
                            key={a.email}
                            type="button"
                            onClick={() => {
                              setGeneral(prev => ({ ...prev, email: a.email }));
                              setAuditorOpen(false);
                            }}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                          >
                            <div className="font-medium">{a.nombre}</div>
                            <div className="text-xs text-gray-500">{a.email}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <FormField
                    label="AUDITOR"
                    type="text"
                    value={matchedAuditor?.nombre || ""}
                    disabled
                  >
                    <input
                      disabled
                      className="w-full px-4 py-2 border rounded-md bg-gray-100 text-gray-700"
                      placeholder="Se completa automáticamente"
                      value={matchedAuditor?.nombre || ""}
                    />
                  </FormField>

                  <FormField
                    label="CÓDIGO DE ALTERNATIVA"
                    name="codigo"
                    required
                    type="number"
                    placeholder="Ej: 12345"
                    icon={<Hash className="w-5 h-5" />}
                    error={errors.codigo}
                    value={general.codigo}
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

              {/* BOTÓN FINAL */}
              <div className="pt-6">
                <Button
                  type="button"
                  onClick={() => {
                    const frontErrors = validateGeneral();
                    if (Object.keys(frontErrors).length > 0) {
                      scrollToFirstError(frontErrors);
                      toast({
                        title: "Formulario incompleto",
                        description: "Revisa los campos marcados en rojo",
                        variant: "destructive",
                      });
                      return;
                    }
                    setShowConfirmModal(true);
                  }}
                  className="w-full bg-secondary text-secondary-foreground font-semibold py-3 rounded-lg cursor-pointer"
                >
                  Enviar todos los productos
                </Button>
              </div>

            </form>
          </CardContent>
        </Card>
      </div>
      {showConfirmModal && (
        <ConfirmSubmitModal
          onCancel={() => setShowConfirmModal(false)}
          onConfirm={submitAllItems}
          loading={loading}
        />
      )}
    </div>
  );
}
