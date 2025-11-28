"use client";

import { useState } from "react";

interface SubmitResponse {
  success: boolean;
  message: string;
  registroId?: string;
  fieldErrors?: Record<string, string[]>;
}

export function useSubmitAlternativa() {
  const [loading, setLoading] = useState(false);

  const submitAlternativa = async (data: any): Promise<SubmitResponse> => {
    try {
      setLoading(true);

      const res = await fetch("/api/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        return {
          success: false,
          message: result.error || "Error al enviar",
          fieldErrors: result.fieldErrors || {},
        };
      }

      return {
        success: true,
        message: "OK",
        registroId: result.registroId,
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message,
      };
    } finally {
      setLoading(false);
    }
  };

  return { submitAlternativa, loading };
}
