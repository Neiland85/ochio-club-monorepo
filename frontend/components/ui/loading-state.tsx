"use client"

import type React from "react"

import Loader from "./loader"
import ErrorMessage from "./error-message"
import type { LoaderProps, ErrorMessageProps } from "@/types/ui-components"

interface LoadingStateProps {
  isLoading: boolean
  error?: string | null
  children: React.ReactNode
  loaderProps?: Partial<LoaderProps>
  errorProps?: Partial<Omit<ErrorMessageProps, "message">>
  loadingText?: string
  errorTitle?: string
}

export default function LoadingState({
  isLoading,
  error,
  children,
  loaderProps = {},
  errorProps = {},
  loadingText = "Cargando...",
  errorTitle = "Error",
}: LoadingStateProps) {
  if (isLoading) {
    return <Loader text={loadingText} {...loaderProps} />
  }

  if (error) {
    return <ErrorMessage message={error} title={errorTitle} {...errorProps} />
  }

  return <>{children}</>
}
