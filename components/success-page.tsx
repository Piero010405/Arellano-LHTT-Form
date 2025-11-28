"use client"

import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SuccessPageProps {
  onReset: () => void
}

export default function SuccessPage({ onReset }: SuccessPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/10 to-background flex items-center justify-center py-8 px-4">
      <div className="max-w-md mx-auto text-center">
        {/* Success Icon */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-secondary/20 rounded-full blur-xl"></div>
            <CheckCircle className="w-24 h-24 text-secondary relative" />
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-4xl font-bold text-foreground mb-3">¡Enviado Exitosamente!</h1>
        <p className="text-lg text-muted-foreground mb-2">
          Tu formulario LHTT Alternativas ha sido registrado correctamente.
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          Nuestro equipo procesará tu información y te contactaremos pronto.
        </p>

        {/* Details Card */}
        <div className="bg-secondary/5 border border-secondary/20 rounded-lg p-6 mb-8">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">ID de Registro:</span> #ARY-2025-001
          </p>
          <p className="text-xs text-muted-foreground mt-2">Se ha enviado una confirmación a tu correo electrónico.</p>
        </div>

        {/* Action Button */}
        <Button
          onClick={onReset}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
        >
          Enviar Otra Respuesta
        </Button>

        {/* Footer Message */}
        <p className="text-xs text-muted-foreground mt-6">¿Necesitas ayuda? Contáctanos a soporte@arellano.com</p>
      </div>
    </div>
  )
}
