'use client';

import React, { useState } from 'react';
import { ArrowLeft, Trash2 } from 'lucide-react';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Separator from '@/components/ui/separator';
import CartItem from './cart/cart-item';
import CartSummary from './cart/cart-summary';
import PromoCode from './cart/promo-code';
import DeliveryOptions from './cart/delivery-options';

// Ajuste del tipo ShoppingCartProps y corrección de propiedades faltantes
interface ShoppingCartProps {
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    product?: {
      isAvailable?: boolean;
      name?: string;
      price?: number;
      maxQuantity?: number;
    };
    subtotal?: number;
    notes?: string;
  }>;
  summary: {
    subtotal: number;
    discount: number;
    total: number;
    currency: string;
    itemCount?: number;
    deliveryFee?: number;
  };
  onUpdateQuantity: (id: string, quantity: number) => void;
  onCheckout: () => void;
  isLoading: boolean;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({
  items,
  summary,
  onUpdateQuantity,
  onCheckout,
  isLoading,
}) => {
  const [deliveryOption, setDeliveryOption] = useState<string>('pickup');
  const [appliedPromoCode, setAppliedPromoCode] = useState<string>('');
  const [promoDiscount, setPromoDiscount] = useState<number>(0);

  const handleApplyPromoCode = (code: string) => {
    const promoCodes: Record<string, number> = {
      OCHÍO10: 2.5,
      PRIMERA: 5.0,
      ESTUDIANTE: 1.5,
    };

    if (promoCodes[code]) {
      setAppliedPromoCode(code);
      setPromoDiscount(promoCodes[code]);
    } else {
      setAppliedPromoCode('');
      setPromoDiscount(0);
    }
  };

  const isEmpty = items.length === 0;

  if (isEmpty) {
    return (
      <div className={`max-w-2xl mx-auto`}>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h2 className="text-xl font-semibold mb-2">
              Tu carrito está vacío
            </h2>
            <p className="text-muted-foreground text-center mb-6">
              Añade algunos deliciosos ochíos a tu carrito para comenzar
            </p>
            <Button
              onClick={onCheckout}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Continuar Comprando
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`max-w-6xl mx-auto`}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    Carrito de Compras
                  </CardTitle>
                  <CardDescription>
                    {summary.itemCount}{' '}
                    {summary.itemCount === 1 ? 'producto' : 'productos'} en tu
                    carrito
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={onCheckout}
                    className="px-4 py-2 border rounded"
                  >
                    Seguir Comprando
                  </Button>
                  <Button
                    onClick={onCheckout}
                    className="px-4 py-2 border rounded text-red-600 hover:bg-red-50"
                    disabled={isLoading}
                  >
                    Vaciar Carrito
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="space-y-4">
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={(quantity: number) =>
                  onUpdateQuantity(item.id, quantity)
                }
                onRemove={() => onCheckout()}
                isLoading={isLoading}
              />
            ))}
          </div>

          {/* Opciones de entrega */}
          <DeliveryOptions
            selectedOption={deliveryOption}
            onOptionChange={setDeliveryOption}
            deliveryFee={summary.deliveryFee}
          />

          {/* Código promocional */}
          <PromoCode
            onApplyPromoCode={handleApplyPromoCode}
            appliedCode={appliedPromoCode}
            discount={promoDiscount}
            isLoading={isLoading}
          />
        </div>

        {/* Resumen y checkout */}
        <div className="space-y-6">
          <div className="sticky top-6">
            <CartSummary
              summary={summary}
              onProceedToCheckout={onCheckout}
              isCheckoutDisabled={isLoading}
              isLoading={isLoading}
            />
          </div>

          {/* Información adicional */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Información de Compra</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <span>Productos artesanales hechos con amor</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Ingredientes frescos y locales</span>
              </div>
              <Separator />
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>• Devoluciones gratuitas en 24h</p>
                <p>• Soporte al cliente 24/7</p>
                <p>• Garantía de frescura</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;

// Interfaces
interface CartItem {
  id: string;
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl?: string;
    maxQuantity?: number;
    isAvailable: boolean;
  };
  quantity: number;
  subtotal: number;
  notes?: string;
}

interface CartSummary {
  subtotal: number;
  tax: number;
  taxRate: number;
  deliveryFee: number;
  discount: number;
  total: number;
  itemCount: number;
  currency: string;
}

interface DeliveryOption {
  label: string;
  value: string;
  fee: number;
}
