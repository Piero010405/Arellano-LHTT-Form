"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import FormField from "@/components/form-field"
import { MapPin, Mail, Hash, Search, Lock, Package, Warehouse, Snowflake, DollarSign } from "lucide-react"

interface FormData {
  cluster: string
  email: string
  codigo: string
  busqueda: string
  nankey: string
  inventarioSala: string
  inventarioDeposito: string
  inventarioFrio: string
  precio: string
}

interface ArellanoFormProps {
  onSubmit: (data: FormData) => void
}

export default function ArellanoForm({ onSubmit }: ArellanoFormProps) {
  const [formData, setFormData] = useState<FormData>({
    cluster: "",
    email: "",
    codigo: "",
    busqueda: "",
    nankey: "12345",
    inventarioSala: "",
    inventarioDeposito: "",
    inventarioFrio: "",
    precio: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Validar campos obligatorios
    if (!formData.cluster) newErrors.cluster = "Este campo es obligatorio"
    if (!formData.email) newErrors.email = "Este campo es obligatorio"
    if (!formData.email && formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Ingresa un correo válido"
    }
    if (!formData.codigo) newErrors.codigo = "Este campo es obligatorio"
    if (!formData.busqueda) newErrors.busqueda = "Este campo es obligatorio"
    if (!formData.precio) newErrors.precio = "Este campo es obligatorio"

    // Validar que al menos uno de los inventarios tenga un valor
    const inventorioValues = [
      Number.parseInt(formData.inventarioSala) || 0,
      Number.parseInt(formData.inventarioDeposito) || 0,
      Number.parseInt(formData.inventarioFrio) || 0,
    ]
    const hasInventory = inventorioValues.some((val) => val > 0)
    if (!hasInventory) {
      setErrors((prev) => ({
        ...prev,
        inventoryWarning:
          "Al menos uno de los campos de inventario (Sala, Depósito, Frío) debe contener un valor numérico",
      }))
      return false
    }

    // Validar precio
    const precioNum = Number.parseFloat(formData.precio)
    if (precioNum <= 0) newErrors.precio = "El precio debe ser mayor a cero"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Limpiar error al escribir
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      setIsSubmitting(true)
      // Simular envío
      setTimeout(() => {
        onSubmit(formData)
        setIsSubmitting(false)
      }, 500)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-slate-50 py-8 px-4 md:py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header with Logo Space */}
        <div className="mb-8 text-center">
          <div className="mb-4 h-16 bg-primary rounded-lg flex items-center justify-center border-2 border-primary">
            <span className="text-white text-lg font-bold tracking-wider">ARELLANO</span>
          </div>
          <h1 className="text-4xl font-bold text-primary mb-2">Formulario LHTT</h1>
          <p className="text-muted-foreground">Alternativas de Gestión</p>
        </div>

        {/* Main Form Card */}
        <Card className="shadow-lg border border-border">
          <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
            <CardTitle className="text-2xl">Registro de Alternativas</CardTitle>
          </CardHeader>

          <CardContent className="pt-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Section 1: Información General */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">Información General</h3>
                <div className="pl-4 border-l-4 border-primary space-y-4">
                  <FormField label="CLUSTER" required icon={<MapPin className="w-5 h-5" />} error={errors.cluster}>
                    <select
                      name="cluster"
                      value={formData.cluster}
                      onChange={handleChange}
                      className="w-full px-4 py-2 pl-10 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Selecciona un cluster</option>
                      <option value="Cluster Norte">Cluster Norte</option>
                      <option value="Cluster Centro">Cluster Centro</option>
                      <option value="Cluster Sur">Cluster Sur</option>
                    </select>
                  </FormField>

                  <FormField
                    label="CORREO ARELLANO"
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

              {/* Section 2: Datos del Código y Producto */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">Datos del Producto</h3>
                <div className="pl-4 border-l-4 border-primary space-y-4">
                  <FormField
                    label="CODIGO DE ALTERNATIVA"
                    required
                    type="number"
                    placeholder="Ej: 12345"
                    icon={<Hash className="w-5 h-5" />}
                    error={errors.codigo}
                    name="codigo"
                    value={formData.codigo}
                    onChange={handleChange}
                  />

                  <FormField
                    label="BUSQUEDA POR (DESCRIPCIÓN DEL PRODUCTO)"
                    required
                    type="text"
                    placeholder="Descripción del producto"
                    icon={<Search className="w-5 h-5" />}
                    error={errors.busqueda}
                    name="busqueda"
                    value={formData.busqueda}
                    onChange={handleChange}
                  />

                  <FormField
                    label="NANKEY"
                    required={false}
                    type="number"
                    icon={<Lock className="w-5 h-5" />}
                    disabled
                    name="nankey"
                    value={formData.nankey}
                    onChange={handleChange}
                  />
                  <p className="text-xs text-muted-foreground italic">
                    Este campo es no editable y se completa automáticamente.
                  </p>
                </div>
              </div>

              {/* Section 3: Niveles de Inventario */}
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
                    required={false}
                    type="number"
                    placeholder="0"
                    icon={<Package className="w-5 h-5" />}
                    name="inventarioSala"
                    value={formData.inventarioSala}
                    onChange={handleChange}
                  />

                  <FormField
                    label="INVENTARIO EN DEPÓSITO"
                    required={false}
                    type="number"
                    placeholder="0"
                    icon={<Warehouse className="w-5 h-5" />}
                    name="inventarioDeposito"
                    value={formData.inventarioDeposito}
                    onChange={handleChange}
                  />

                  <FormField
                    label="INVENTARIO EN FRÍO"
                    required={false}
                    type="number"
                    placeholder="0"
                    icon={<Snowflake className="w-5 h-5" />}
                    name="inventarioFrio"
                    value={formData.inventarioFrio}
                    onChange={handleChange}
                  />
                  <p className="text-xs text-muted-foreground italic">
                    Al menos uno de estos campos debe contener un valor numérico para poder enviar el formulario.
                  </p>
                </div>
              </div>

              {/* Section 4: Precio */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">Precio</h3>
                <div className="pl-4 border-l-4 border-primary space-y-4">
                  <FormField
                    label="PRECIO"
                    required
                    type="number"
                    placeholder="0.00"
                    icon={<DollarSign className="w-5 h-5" />}
                    step="0.01"
                    error={errors.precio}
                    name="precio"
                    value={formData.precio}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Submit Button */}
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
  )
}
