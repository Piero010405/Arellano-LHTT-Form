"use client";

import { useState } from "react";
import ArellanoForm from "@/components/arellano-form";
import SuccessPage from "@/components/success-page";

export default function Home() {
  const [registroId, setRegistroId] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-background">
      {!registroId ? (
        <ArellanoForm onSuccess={(id) => setRegistroId(id)} />
      ) : (
        <SuccessPage registroId={registroId} onReset={() => setRegistroId(null)} />
      )}
    </main>
  );
}
