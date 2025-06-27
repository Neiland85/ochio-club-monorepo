'use client';

import type React from 'react';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AlertCircle, Loader2, Save, X } from 'lucide-react';
import type {
  AddressFormProps,
  AddressFormData,
  AddressFormErrors,
} from '@/types/address-selector';

const SPANISH_PROVINCES = [
  'Álava',
  'Albacete',
  'Alicante',
  'Almería',
  'Asturias',
  'Ávila',
  'Badajoz',
  'Barcelona',
  'Burgos',
  'Cáceres',
  'Cádiz',
  'Cantabria',
  'Castellón',
  'Ciudad Real',
  'Córdoba',
  'Cuenca',
  'Girona',
  'Granada',
  'Guadalajara',
  'Gipuzkoa',
  'Huelva',
  'Huesca',
  'Jaén',
  'La Coruña',
  'La Rioja',
  'Las Palmas',
  'León',
  'Lleida',
  'Lugo',
  'Madrid',
  'Málaga',
  'Murcia',
  'Navarra',
  'Ourense',
  'Palencia',
  'Pontevedra',
  'Salamanca',
  'Segovia',
  'Sevilla',
  'Soria',
  'Tarragona',
  'Teruel',
  'Toledo',
  'Valencia',
  'Valladolid',
  'Vizcaya',
  'Zamora',
  'Zaragoza',
];

export default function AddressForm({
  address,
  onSubmit,
  onCancel,
  isLoading = false,
}: AddressFormProps) {
  const [formData, setFormData] = useState<AddressFormData>({
    name: address?.name || '',
    street: address?.street || '',
    city: address?.city || '',
    postalCode: address?.postalCode || '',
    province: address?.province || '',
    country: address?.country || 'España',
    recipientName: address?.recipientName || '',
    recipientPhone: address?.recipientPhone || '',
    instructions: address?.instructions || '',
    isDefault: address?.isDefault || false,
  });

  const [errors, setErrors] = useState<AddressFormErrors>({});

  // Validación del formulario
  const validateForm = (): boolean => {
    const newErrors: AddressFormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre de la dirección es obligatorio';
    }

    if (!formData.street.trim()) {
      newErrors.street = 'La dirección es obligatoria';
    } else if (formData.street.length < 5) {
      newErrors.street = 'La dirección debe tener al menos 5 caracteres';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'La ciudad es obligatoria';
    }

    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'El código postal es obligatorio';
    } else if (!/^\d{5}$/.test(formData.postalCode)) {
      newErrors.postalCode = 'El código postal debe tener 5 dígitos';
    }

    if (!formData.province.trim()) {
      newErrors.province = 'La provincia es obligatoria';
    }

    if (!formData.recipientName.trim()) {
      newErrors.recipientName = 'El nombre del destinatario es obligatorio';
    }

    if (!formData.recipientPhone.trim()) {
      newErrors.recipientPhone = 'El teléfono es obligatorio';
    } else if (!/^[+]?[\d\s-()]{9,}$/.test(formData.recipientPhone)) {
      newErrors.recipientPhone = 'Ingresa un número de teléfono válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error saving address:', error);
    }
  };

  const updateField = (
    field: keyof AddressFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field as keyof AddressFormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {address ? 'Editar Dirección' : 'Añadir Nueva Dirección'}
        </CardTitle>
        <CardDescription>
          {address
            ? 'Modifica los datos de tu dirección'
            : 'Completa los datos para añadir una nueva dirección de entrega'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre de la dirección */}
          <div className="space-y-2">
            <Label htmlFor="name">Nombre de la dirección</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="Casa, Trabajo, etc."
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Dirección completa */}
          <div className="space-y-2">
            <Label htmlFor="street">Dirección completa</Label>
            <Input
              id="street"
              value={formData.street}
              onChange={(e) => updateField('street', e.target.value)}
              placeholder="Calle, número, piso, puerta..."
              className={errors.street ? 'border-red-500' : ''}
            />
            {errors.street && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.street}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Ciudad */}
            <div className="space-y-2">
              <Label htmlFor="city">Ciudad</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => updateField('city', e.target.value)}
                placeholder="Úbeda"
                className={errors.city ? 'border-red-500' : ''}
              />
              {errors.city && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.city}
                </p>
              )}
            </div>

            {/* Código postal */}
            <div className="space-y-2">
              <Label htmlFor="postalCode">Código Postal</Label>
              <Input
                id="postalCode"
                value={formData.postalCode}
                onChange={(e) => updateField('postalCode', e.target.value)}
                placeholder="23400"
                className={errors.postalCode ? 'border-red-500' : ''}
              />
              {errors.postalCode && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.postalCode}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Provincia */}
            <div className="space-y-2">
              <Label htmlFor="province">Provincia</Label>
              <Select
                value={formData.province}
                onValueChange={(value) => updateField('province', value)}
              >
                <SelectTrigger
                  className={errors.province ? 'border-red-500' : ''}
                >
                  <SelectValue placeholder="Selecciona una provincia" />
                </SelectTrigger>
                <SelectContent>
                  {SPANISH_PROVINCES.map((province) => (
                    <SelectItem key={province} value={province}>
                      {province}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.province && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.province}
                </p>
              )}
            </div>

            {/* País */}
            <div className="space-y-2">
              <Label htmlFor="country">País</Label>
              <Select
                value={formData.country}
                onValueChange={(value) => updateField('country', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="España">España</SelectItem>
                  <SelectItem value="Portugal">Portugal</SelectItem>
                  <SelectItem value="Francia">Francia</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Información del destinatario */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              Información del Destinatario
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nombre del destinatario */}
              <div className="space-y-2">
                <Label htmlFor="recipientName">Nombre del destinatario</Label>
                <Input
                  id="recipientName"
                  value={formData.recipientName}
                  onChange={(e) => updateField('recipientName', e.target.value)}
                  placeholder="Nombre completo"
                  className={errors.recipientName ? 'border-red-500' : ''}
                />
                {errors.recipientName && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.recipientName}
                  </p>
                )}
              </div>

              {/* Teléfono del destinatario */}
              <div className="space-y-2">
                <Label htmlFor="recipientPhone">
                  Teléfono del destinatario
                </Label>
                <Input
                  id="recipientPhone"
                  value={formData.recipientPhone}
                  onChange={(e) =>
                    updateField('recipientPhone', e.target.value)
                  }
                  placeholder="+34 600 000 000"
                  className={errors.recipientPhone ? 'border-red-500' : ''}
                />
                {errors.recipientPhone && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.recipientPhone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Instrucciones especiales */}
          <div className="space-y-2">
            <Label htmlFor="instructions">
              Instrucciones especiales (opcional)
            </Label>
            <Textarea
              id="instructions"
              value={formData.instructions}
              onChange={(e) => updateField('instructions', e.target.value)}
              placeholder="Timbre, piso, referencias, horarios preferidos..."
              className="resize-none"
              rows={3}
            />
          </div>

          {/* Dirección por defecto */}
          <div className="flex items-center space-x-2">
            <Switch
              id="isDefault"
              checked={formData.isDefault}
              onCheckedChange={(checked) => updateField('isDefault', checked)}
            />
            <Label htmlFor="isDefault">
              Establecer como dirección por defecto
            </Label>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {address ? 'Actualizar' : 'Guardar'} Dirección
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
