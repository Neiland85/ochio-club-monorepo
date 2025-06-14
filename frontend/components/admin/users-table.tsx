"use client"

import { useState } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Search, Filter, Edit, Trash2, MoreHorizontal, UserCheck, UserX, Crown, User, Truck } from "lucide-react"

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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { UsersTableProps, UserRole, UserStatus } from "@/types/admin-panel"

const roleConfig = {
  admin: { label: "Administrador", icon: Crown, className: "bg-purple-100 text-purple-800 border-purple-200" },
  baker: { label: "Panadero", icon: User, className: "bg-blue-100 text-blue-800 border-blue-200" },
  customer: { label: "Cliente", icon: User, className: "bg-green-100 text-green-800 border-green-200" },
  delivery: { label: "Repartidor", icon: Truck, className: "bg-orange-100 text-orange-800 border-orange-200" },
}

const statusConfig = {
  active: { label: "Activo", className: "bg-green-100 text-green-800 border-green-200" },
  inactive: { label: "Inactivo", className: "bg-gray-100 text-gray-800 border-gray-200" },
  suspended: { label: "Suspendido", className: "bg-red-100 text-red-800 border-red-200" },
}

export default function UsersTable({ users, onEdit, onDelete, onStatusChange, isLoading = false }: UsersTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Filtrar usuarios
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter

    return matchesSearch && matchesRole && matchesStatus
  })

  const getRoleIcon = (role: UserRole) => {
    const IconComponent = roleConfig[role].icon
    return <IconComponent className="h-3 w-3" />
  }

  const LoadingSkeleton = () => (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <TableRow key={index}>
          <TableCell>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
              <div className="space-y-1">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-32" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-24" />
              </div>
            </div>
          </TableCell>
          <TableCell>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
          </TableCell>
          <TableCell>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
          </TableCell>
          <TableCell>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
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
        <CardTitle>Gestión de Usuarios</CardTitle>
        <CardDescription>Administra todos los usuarios del sistema</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar usuarios..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[150px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los roles</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="baker">Panadero</SelectItem>
                <SelectItem value="customer">Cliente</SelectItem>
                <SelectItem value="delivery">Repartidor</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Activos</SelectItem>
                <SelectItem value="inactive">Inactivos</SelectItem>
                <SelectItem value="suspended">Suspendidos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tabla */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Registro</TableHead>
                <TableHead>Último acceso</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <LoadingSkeleton />
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No se encontraron usuarios
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                          <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-xs text-muted-foreground">{user.email}</div>
                          {user.phone && <div className="text-xs text-muted-foreground">{user.phone}</div>}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={roleConfig[user.role].className}>
                        {getRoleIcon(user.role)}
                        <span className="ml-1">{roleConfig[user.role].label}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusConfig[user.status].className}>
                        {statusConfig[user.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{format(user.createdAt, "dd/MM/yyyy", { locale: es })}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {user.lastLogin ? format(user.lastLogin, "dd/MM/yyyy HH:mm", { locale: es }) : "Nunca"}
                      </div>
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
                          <DropdownMenuItem onClick={() => onEdit(user)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel>Cambiar estado</DropdownMenuLabel>
                          {Object.entries(statusConfig).map(([status, config]) => (
                            <DropdownMenuItem
                              key={status}
                              onClick={() => onStatusChange(user.id, status as UserStatus)}
                              disabled={user.status === status}
                            >
                              {status === "active" ? (
                                <UserCheck className="h-4 w-4 mr-2" />
                              ) : (
                                <UserX className="h-4 w-4 mr-2" />
                              )}
                              {config.label}
                            </DropdownMenuItem>
                          ))}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => onDelete(user.id)} className="text-red-600">
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
          Mostrando {filteredUsers.length} de {users.length} usuarios
        </div>
      </CardContent>
    </Card>
  )
}
