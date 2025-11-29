import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import { CartProvider } from "@/contexts/cart-context"
import { GeneralFormProvider } from "@/contexts/general-form-context";
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Arellano | Formulario LHTT Alternativas",
  description: "Formulario de gestión de alternativas LHTT",
  generator: "Piero Sarmiento",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`font-sans antialiased`}>
        <GeneralFormProvider>
          <CartProvider>
            {children}
            <Analytics />
            <Toaster />
          </CartProvider>
        </GeneralFormProvider>
      </body>
    </html>
  )
}
