"use client"

import type React from "react"

interface FormFieldProps {
  label: string
  required?: boolean
  type?: string
  name?: string
  placeholder?: string
  icon?: React.ReactNode
  error?: string
  value?: string | number
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  disabled?: boolean
  step?: string
  children?: React.ReactNode
}

export default function FormField({
  label,
  required = false,
  type = "text",
  name = label.toLowerCase().replace(/\s+/g, "_"),
  placeholder = "",
  icon,
  error,
  value = "",
  onChange,
  disabled = false,
  step,
  children,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary pointer-events-none">
            {icon}
          </div>
        )}

        {children ? (
          children
        ) : (
          <input
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
            step={step}
            className={`w-full px-4 py-2 ${icon ? "pl-10" : ""} border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
              disabled ? "bg-muted text-muted-foreground cursor-not-allowed" : "bg-background text-foreground"
            } ${error ? "border-red-500" : "border-border"}`}
          />
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
