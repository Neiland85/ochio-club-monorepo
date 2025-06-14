"use client"

import type React from "react"

import { AlertCircle, AlertTriangle, Info, X, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { ErrorMessageProps, ErrorType } from "@/types/ui-components"

const typeConfig: Record<ErrorType, { icon: React.ComponentType<any>; className: string }> = {
  error: {
    icon: AlertCircle,
    className: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
  },
  warning: {
    icon: AlertTriangle,
    className: "border-yellow-500/50 text-yellow-600 dark:border-yellow-500 [&>svg]:text-yellow-600",
  },
  info: {
    icon: Info,
    className: "border-blue-500/50 text-blue-600 dark:border-blue-500 [&>svg]:text-blue-600",
  },
}

export default function ErrorMessage({
  message,
  type = "error",
  title,
  onRetry,
  onDismiss,
  className = "",
  showIcon = true,
  retryText = "Reintentar",
  dismissText = "Cerrar",
}: ErrorMessageProps) {
  const config = typeConfig[type]
  const IconComponent = config.icon

  return (
    <Alert className={`${config.className} ${className}`}>
      {showIcon && <IconComponent className="h-4 w-4" />}

      <div className="flex-1">
        {title && <AlertTitle>{title}</AlertTitle>}
        <AlertDescription className={title ? "mt-1" : ""}>{message}</AlertDescription>
      </div>

      {/* Botones de acción */}
      {(onRetry || onDismiss) && (
        <div className="flex items-center gap-2 ml-auto">
          {onRetry && (
            <Button variant="outline" size="sm" onClick={onRetry} className="h-8">
              <RefreshCw className="h-3 w-3 mr-1" />
              {retryText}
            </Button>
          )}
          {onDismiss && (
            <Button variant="ghost" size="sm" onClick={onDismiss} className="h-8 w-8 p-0">
              <X className="h-3 w-3" />
              <span className="sr-only">{dismissText}</span>
            </Button>
          )}
        </div>
      )}
    </Alert>
  )
}
