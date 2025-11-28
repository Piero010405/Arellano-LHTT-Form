"use client";

import React, { forwardRef } from "react";

interface FormFieldProps {
  label: string;
  required?: boolean;
  type?: string;
  name?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  error?: string;
  value?: string | number | undefined;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  disabled?: boolean;
  step?: string;
  children?: React.ReactNode;
}

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  (
    {
      label,
      required = false,
      type = "text",
      name,
      placeholder = "",
      icon,
      error,
      value,
      onChange,
      disabled = false,
      step,
      children,
    },
    ref
  ) => {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>

        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-primary pointer-events-none">
              {icon}
            </div>
          )}

          {children ? (
            children
          ) : (
            <input
              ref={ref}
              type={type}
              name={name}
              placeholder={placeholder}
              value={value ?? ""}
              onChange={onChange}
              disabled={disabled}
              step={step}
              autoComplete="off"
              onWheel={(e) => e.currentTarget.blur()}
              className={`w-full px-4 py-2 ${
                icon ? "pl-10" : ""
              } border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                disabled
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : "bg-background text-foreground"
              } ${error ? "border-red-500" : "border-border"}`}
            />
          )}
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

FormField.displayName = "FormField";

export default FormField;
