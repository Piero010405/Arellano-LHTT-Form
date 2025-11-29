"use client";

import { createContext, useContext, useState, useEffect } from "react";

interface GeneralFormState {
  cluster: string;
  email: string;
  codigo: string;
}

interface GeneralFormContextType {
  general: GeneralFormState;
  setGeneral: React.Dispatch<React.SetStateAction<GeneralFormState>>;
  clearGeneral: () => void;
}

const GeneralFormContext = createContext<GeneralFormContextType | null>(null);

export function GeneralFormProvider({ children }: { children: React.ReactNode }) {
  const [general, setGeneral] = useState<GeneralFormState>({
    cluster: "",
    email: "",
    codigo: "",
  });

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("general-form");
    if (saved) {
      setGeneral(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("general-form", JSON.stringify(general));
  }, [general]);

  const clearGeneral = () => {
    setGeneral({ cluster: "", email: "", codigo: "" });
    localStorage.removeItem("general-form");
  };

  return (
    <GeneralFormContext.Provider value={{ general, setGeneral, clearGeneral }}>
      {children}
    </GeneralFormContext.Provider>
  );
}

export function useGeneralForm() {
  const ctx = useContext(GeneralFormContext);
  if (!ctx) throw new Error("useGeneralForm must be used within GeneralFormProvider");
  return ctx;
}
