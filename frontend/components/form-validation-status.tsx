"use client"

import { CheckCircle, XCircle, AlertCircle } from "lucide-react"

interface ValidationRule {
  label: string
  isValid: boolean
  isActive: boolean
}

interface FormValidationStatusProps {
  rules: ValidationRule[]
  className?: string
}

export default function FormValidationStatus({ rules, className = "" }: FormValidationStatusProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <h4 className="text-sm font-medium text-muted-foreground">Requisitos de la contraseña:</h4>
      <div className="space-y-1">
        {rules.map((rule, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            {rule.isValid ? (
              <CheckCircle className="h-3 w-3 text-green-600" />
            ) : rule.isActive ? (
              <XCircle className="h-3 w-3 text-red-600" />
            ) : (
              <AlertCircle className="h-3 w-3 text-muted-foreground" />
            )}
            <span
              className={rule.isValid ? "text-green-600" : rule.isActive ? "text-red-600" : "text-muted-foreground"}
            >
              {rule.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
