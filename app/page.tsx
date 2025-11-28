"use client"

import { useState } from "react"
import ArellanoForm from "@/components/arellano-form"
import SuccessPage from "@/components/success-page"

export default function Home() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState<any>(null)

  const handleSubmit = (data: any) => {
    setFormData(data)
    setIsSubmitted(true)
  }

  const handleReset = () => {
    setIsSubmitted(false)
    setFormData(null)
  }

  return (
    <main className="min-h-screen bg-background">
      {!isSubmitted ? <ArellanoForm onSubmit={handleSubmit} /> : <SuccessPage onReset={handleReset} />}
    </main>
  )
}
