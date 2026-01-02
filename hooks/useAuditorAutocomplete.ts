// src/hooks/useAuditorAutocomplete.ts
"use client";

import { useMemo } from "react";
import auditors from "@/data/auditors.json";

export interface Auditor {
  codigo: number;
  codigo_cdar: number;
  nombre: string;
  email: string;
}

export function useAuditorAutocomplete(query: string) {
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];

    return (auditors as Auditor[])
      .filter(a =>
        a.email.toLowerCase().includes(q) ||
        a.nombre.toLowerCase().includes(q)
      )
      .slice(0, 6);
  }, [query]);

  const matchedAuditor = useMemo(() => {
    return (auditors as Auditor[]).find(
      a => a.email.toLowerCase() === query.toLowerCase()
    );
  }, [query]);

  return { results, matchedAuditor };
}
