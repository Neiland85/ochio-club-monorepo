"use client"

import type React from "react"

import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SummaryCardProps {
  title: string
  value: string | number
  description?: string
  icon: React.ReactNode
  percentageChange?: number
  trend?: "up" | "down" | "neutral"
  className?: string
}

export default function SummaryCard({
  title,
  value,
  description,
  icon,
  percentageChange,
  trend = "neutral",
  className = "",
}: SummaryCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(description || percentageChange !== undefined) && (
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            {percentageChange !== undefined && (
              <span
                className={`mr-1 flex items-center ${
                  trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : ""
                }`}
              >
                {trend === "up" ? (
                  <ArrowUpIcon className="h-3 w-3 mr-1" />
                ) : trend === "down" ? (
                  <ArrowDownIcon className="h-3 w-3 mr-1" />
                ) : null}
                {Math.abs(percentageChange)}%
              </span>
            )}
            {description && <span>{description}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
