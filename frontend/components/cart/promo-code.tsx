'use client';

import type React from 'react';

import { useState } from 'react';
import { Tag, Check, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { PromoCodeProps } from '@/types/shopping-cart';

export default function PromoCode({
  onApplyPromoCode,
  isLoading = false,
  appliedCode,
  discount = 0,
  className = '',
}: PromoCodeProps) {
  const [promoCode, setPromoCode] = useState('');
  const [error, setError] = useState('');

  const handleApplyCode = () => {
    if (!promoCode.trim()) {
      setError('Ingresa un código promocional');
      return;
    }

    setError('');
    onApplyPromoCode(promoCode.trim().toUpperCase());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPromoCode(e.target.value);
    if (error) setError('');
  };

  const formatCurrency = (amount: number) => `${amount.toFixed(2)}€`;

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Tag className="h-4 w-4" />
          Código Promocional
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Código aplicado */}
        {appliedCode && discount > 0 ? (
          <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800">
                  Código aplicado: {appliedCode}
                </p>
                <p className="text-xs text-green-600">
                  Descuento: {formatCurrency(discount)}
                </p>
              </div>
            </div>
            <Badge
              variant="outline"
              className="bg-green-100 text-green-800 border-green-200"
            >
              Aplicado
            </Badge>
          </div>
        ) : (
          /* Formulario para ingresar código */
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder="Ingresa tu código"
                value={promoCode}
                onChange={handleInputChange}
                className={error ? 'border-red-500' : ''}
                disabled={isLoading}
                onKeyDown={(e) => e.key === 'Enter' && handleApplyCode()}
              />
              <Button
                onClick={handleApplyCode}
                disabled={isLoading || !promoCode.trim()}
                size="sm"
              >
                {isLoading ? 'Aplicando...' : 'Aplicar'}
              </Button>
            </div>
            {error && (
              <div className="flex items-center gap-1 text-sm text-red-600">
                <X className="h-3 w-3" />
                {error}
              </div>
            )}
          </div>
        )}

        {/* Códigos sugeridos */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Códigos disponibles:</p>
          <div className="flex flex-wrap gap-1">
            {['OCHÍO10', 'PRIMERA', 'ESTUDIANTE'].map((code) => (
              <Button
                key={code}
                variant="outline"
                size="sm"
                className="h-6 text-xs"
                onClick={() => setPromoCode(code)}
                disabled={isLoading || appliedCode === code}
              >
                {code}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
