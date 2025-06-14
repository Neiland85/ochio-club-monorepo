"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, MoreHorizontal } from "lucide-react"
import type { Bakery, BakeryStatus } from "@/types/bakery-dashboard"

interface BakeriesTableProps {
  bakeries: Bakery[];
  onEdit: (bakery: Bakery) => void;
  onDelete: (bakeryId: string) => void;
  onStatusChange: (bakeryId: string, status: BakeryStatus) => void;
  isLoading?: boolean;
}

const statusConfig = {
  active: { label: "Activa", className: "bg-green-100 text-green-800 border-green-200" },
  inactive: { label: "Inactiva", className: "bg-gray-100 text-gray-800 border-gray-200" },
  pending: { label: "Pendiente", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  suspended: { label: "Suspendida", className: "bg-red-100 text-red-800 border-red-200" },
}

export default function BakeriesTable({
  bakeries,
  onEdit,
  onDelete,
  onStatusChange,
  isLoading = false,
}: BakeriesTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [cityFilter, setCityFilter] = useState<string>("all")

  // Obtener ciudades únicas
  const cities = ["all", ...new Set(bakeries.map((bakery) => bakery.city))]

  // Filtrar panaderías
  const filteredBakeries = bakeries.filter((bakery) => {
    const matchesSearch =
      bakery.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bakery.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bakery.address.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || bakery.status === statusFilter
    const matchesCity = cityFilter === "all" || bakery.city === cityFilter

    return matchesSearch && matchesStatus && matchesCity
  })

  const LoadingSkeleton = () => (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <TableRow key={index}>
          <TableCell>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-gray-200 rounded-md animate-pulse" />
            </div>
          </TableCell>
          <TableCell>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
          </TableCell>
          <TableCell>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
          </TableCell>
          <TableCell>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
          </TableCell>
          <TableCell>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
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
        <CardTitle>Gestión de Panaderías</CardTitle>
        <CardDescription>Administra todas las panaderías registradas</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Input
              placeholder="Buscar panaderías..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border rounded px-2">
              <option value="all">Todos los estados</option>
              <option value="active">Activa</option>
              <option value="inactive">Inactiva</option>
              <option value="pending">Pendiente</option>
              <option value="suspended">Suspendida</option>
            </select>
            <select value={cityFilter} onChange={e => setCityFilter(e.target.value)} className="border rounded px-2">
              {cities.map(city => (
                <option key={city} value={city}>{city === "all" ? "Todas las ciudades" : city}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tabla */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Propietario</TableHead>
                <TableHead>Ciudad</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Pedidos</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <LoadingSkeleton />
              ) : filteredBakeries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No se encontraron panaderías
                  </TableCell>
                </TableRow>
              ) : (
                filteredBakeries.map((bakery) => (
                  <TableRow key={bakery.id}>
                    <TableCell>{bakery.name}</TableCell>
                    <TableCell>{bakery.owner}</TableCell>
                    <TableCell>{bakery.city}</TableCell>
                    <TableCell>
                      <Badge className={statusConfig[bakery.status].className}>
                        {statusConfig[bakery.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell>{bakery.totalOrders}</TableCell>
                    <TableCell className="text-right">
                      <Button size="icon" variant="ghost" onClick={() => onEdit(bakery)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => onDelete(bakery.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div className="text-sm text-muted-foreground">
          Mostrando {filteredBakeries.length} de {bakeries.length} panaderías
        </div>
      </CardContent>
    </Card>
  )
}