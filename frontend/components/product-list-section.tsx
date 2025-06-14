"use client"

import ProductList from "./product-list"
import type { ProductListProps } from "@/types/product-list"

interface ProductListSectionProps extends ProductListProps {
  title?: string
  subtitle?: string
  showHeader?: boolean
}

export default function ProductListSection({
  title = "Productos",
  subtitle,
  showHeader = true,
  ...productListProps
}: ProductListSectionProps) {
  return (
    <section className="py-8">
      {showHeader && (
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold mb-2">{title}</h2>
          {subtitle && <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{subtitle}</p>}
        </div>
      )}

      <ProductList {...productListProps} />
    </section>
  )
}
