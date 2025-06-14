"use client"

import { useState } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Edit, Trash2, Plus, Search, Filter, Star } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { DashboardProduct } from "@/types/bakery-dashboard"

interface ProductsSectionProps {
  products: DashboardProduct[]
  onAddProduct: () => void
  onEditProduct: (product: DashboardProduct) => void
  onDeleteProduct: (productId: string) => void
  className?: string
}

export default function ProductsSection({
  products,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  className = "",
}: ProductsSectionProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Obtener categorías únicas
  const categories = ["all", ...new Set(products.map((product) => product.category))]

  // Filtrar productos
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && product.isActive) ||
      (statusFilter === "inactive" && !product.isActive) ||
      (statusFilter === "outOfStock" && product.isOutOfStock) ||
      (statusFilter === "featured" && product.isFeatured)

    return matchesSearch && matchesCategory && matchesStatus
  })

  const formatCurrency = (amount: number) => `${amount.toFixed(2)}€`

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div>
            <CardTitle>Gestión de Productos</CardTitle>
            <CardDescription>Administra tu catálogo de ochíos artesanales</CardDescription>
          </div>
          <Button onClick={onAddProduct}>
            <Plus className="h-4 w-4 mr-2" />
            Añadir Producto
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar productos..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categories
                  .filter((c) => c !== "all")
                  .map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Activos</SelectItem>
                <SelectItem value="inactive">Inactivos</SelectItem>
                <SelectItem value="outOfStock">Agotados</SelectItem>
                <SelectItem value="featured">Destacados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tabla de productos */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead className="text-right">Precio</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Actualizado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No se encontraron productos
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow key={product.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-md overflow-hidden bg-muted flex-shrink-0">
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl || "/placeholder.svg"}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full bg-muted" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1">
                            <div className="font-medium truncate">{product.name}</div>
                            {product.isFeatured && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">{product.description}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(product.price)}</TableCell>
                    <TableCell>
                      {product.stock !== undefined ? (
                        <span className={product.stock <= 5 ? "text-red-600 font-medium" : ""}>{product.stock}</span>
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {product.isActive ? (
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                            Activo
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
                            Inactivo
                          </Badge>
                        )}
                        {product.isOutOfStock && (
                          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                            Agotado
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {format(product.updatedAt, "dd/MM/yy", { locale: es })}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => onEditProduct(product)}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Eliminar</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Información de productos */}
        <div className="text-sm text-muted-foreground">
          Mostrando {filteredProducts.length} de {products.length} productos
        </div>
      </CardContent>
    </Card>
  )
}
