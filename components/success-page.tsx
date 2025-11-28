"use client";

import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SuccessPageProps {
  onReset: () => void;
  registroId: string;
}

export default function SuccessPage({ onReset, registroId }: SuccessPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center py-10 px-4">
      <div className="max-w-md mx-auto text-center">

        <CheckCircle className="w-24 h-24 text-secondary mx-auto mb-6" />

        <h1 className="text-3xl font-bold mb-2">¡Enviado Exitosamente!</h1>

        <p className="text-muted-foreground mb-6">
          La alternativa fue registrada correctamente.
        </p>

        <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-4 mb-8">
          <p className="text-sm">
            <span className="font-semibold">ID de Registro: </span>
            {registroId}
          </p>
        </div>

        <Button
          onClick={onReset}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-lg cursor-pointer"
        >
          Enviar otra respuesta
        </Button>
      </div>
    </div>
  );
}
