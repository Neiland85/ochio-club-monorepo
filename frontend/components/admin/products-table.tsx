"use client"

import { useState } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Search, Filter, Edit, Trash2, MoreHorizontal, Star, Package, TrendingUp } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { ProductsTableProps, ProductStatus } from "@/types/admin-panel"

const statusConfig = {
  active: { label: "Activo", className: "bg-green-100 text-green-800 border-green-200" },
  inactive: { label: "Inactivo", className: "bg-gray-100 text-gray-800 border-gray-200" },
  discontinued: { label: "Descontinuado", className: "bg-red-100 text-red-800 border-red-200" },
}

export default function ProductsTable({
  products,
  onEdit,
  onDelete,
  onStatusChange,
  isLoading = false,
}: ProductsTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [bakeryFilter, setBakeryFilter] = useState<string>("all")

  // Obtener categorías y panaderías únicas
  const categories = ["all", ...new Set(products.map((product) => product.category))]
  const bakeries = ["all", ...new Set(products.map((product) => product.bakeryName))]

  // Filtrar productos
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.bakeryName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || product.status === statusFilter
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
    const matchesBakery = bakeryFilter === "all" || product.bakeryName === bakeryFilter

    return matchesSearch && matchesStatus && matchesCategory && matchesBakery
  })

  const formatCurrency = (amount: number) => `${amount.toFixed(2)}€`

  const LoadingSkeleton = () => (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <TableRow key={index}>
          <TableCell>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gray-200 rounded-md animate-pulse" />
              <div className="space-y-1">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-32" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-24" />
              </div>
            </div>
          </TableCell>
          <TableCell>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
          </TableCell>
          <TableCell>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
          </TableCell>
          <TableCell>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-12" />
          </TableCell>
          <TableCell>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
          </TableCell>
          <TableCell>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-12" />
          </TableCell>
          <TableCell>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
          </TableCell>
          <TableCell>
            <div className="h-8 bg-gray-200 rounded animate-pulse w-8" />
          </TableCell>
        </TableRow>
      ))}
    </>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestión de Productos</CardTitle>
        <CardDescription>Administra todos los productos del sistema</CardDescription>
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Activos</SelectItem>
                <SelectItem value="inactive">Inactivos</SelectItem>
                <SelectItem value="discontinued">Descontinuados</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {categories
                  .filter((c) => c !== "all")
                  .map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Select value={bakeryFilter} onValueChange={setBakeryFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Panadería" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {bakeries
                  .filter((b) => b !== "all")
                  .map((bakery) => (
                    <SelectItem key={bakery} value={bakery}>
                      {bakery}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tabla */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Panadería</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead className="text-right">Precio</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Ventas</TableHead>
                <TableHead>Actualizado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <LoadingSkeleton />
              ) : filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
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
                    <TableCell>
                      <div className="font-medium">{product.bakeryName}</div>
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(product.price)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Package className="h-3 w-3 text-muted-foreground" />
                        <span className={product.stock <= 5 ? "text-red-600 font-medium" : ""}>{product.stock}</span>
                        {product.isOutOfStock && (
                          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200 text-xs">
                            Agotado
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusConfig[product.status].className}>
                        {statusConfig[product.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-muted-foreground" />
                        <span className="font-medium">{product.totalSales}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{format(product.updatedAt, "dd/MM/yy", { locale: es })}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Abrir menú</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => onEdit(product)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel>Cambiar estado</DropdownMenuLabel>
                          {Object.entries(statusConfig).map(([status, config]) => (
                            <DropdownMenuItem
                              key={status}
                              onClick={() => onStatusChange(product.id, status as ProductStatus)}
                              disabled={product.status === status}
                            >
                              {config.label}
                            </DropdownMenuItem>
                          ))}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => onDelete(product.id)} className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Información de resultados */}
        <div className="text-sm text-muted-foreground">
          Mostrando {filteredProducts.length} de {products.length} productos
        </div>
      </CardContent>
    </Card>
  )
}
