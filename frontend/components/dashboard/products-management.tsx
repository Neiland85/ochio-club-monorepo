"use client"

import { useState } from "react"
import { Edit, Trash2, Plus, Search, Filter } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { BakeryProduct } from "@/types/bakery-dashboard"

interface ProductsManagementProps {
  products: BakeryProduct[]
  onAddProduct: () => void
  onEditProduct: (product: BakeryProduct) => void
  onDeleteProduct: (productId: string) => void
  className?: string
}

export default function ProductsManagement({
  products,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  className = "",
}: ProductsManagementProps) {
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

  return (
    <Card className={className}>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div>
          <CardTitle>Gestión de Productos</CardTitle>
          <CardDescription>Administra tu catálogo de ochíos</CardDescription>
        </div>
        <Button onClick={onAddProduct}>
          <Plus className="h-4 w-4 mr-2" />
          Añadir Producto
        </Button>
      </CardHeader>
      <CardContent>
        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
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
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
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
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    No se encontraron productos
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {product.imageUrl ? (
                          <div className="h-10 w-10 rounded-md overflow-hidden bg-muted">
                            <img
                              src={product.imageUrl || "/placeholder.svg"}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-10 w-10 rounded-md bg-muted" />
                        )}
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-xs text-muted-foreground line-clamp-1">{product.description}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell className="text-right">{product.price.toFixed(2)}€</TableCell>
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
                        {product.isFeatured && (
                          <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
                            Destacado
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => onEditProduct(product)}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => onDeleteProduct(product.id)}>
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
      </CardContent>
    </Card>
  )
}
