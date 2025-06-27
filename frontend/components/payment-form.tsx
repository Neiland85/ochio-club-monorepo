'use client';

import type React from 'react';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreditCard, Lock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import CardTypeIcon from './card-type-icon';
import {
  paymentFormSchema,
  type PaymentFormValues,
  type PaymentFormProps,
  detectCardType,
} from '@/types/payment-form';

export default function PaymentForm({
  onSubmit,
  amount,
  currency = 'EUR',
  isSubmitting = false,
  defaultValues,
  className = '',
  showSaveCardOption = true,
}: PaymentFormProps) {
  const [cardType, setCardType] = useState('unknown');

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      cardholderName: '',
      cardNumber: '',
      expiryDate: '',
      cvc: '',
      saveCard: false,
      ...defaultValues,
    },
  });

  const handleSubmit = (data: PaymentFormValues) => {
    onSubmit(data);
  };

  // Formatear número de tarjeta mientras se escribe
  const formatCardNumber = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    let formattedValue = '';

    // Diferentes formatos según el tipo de tarjeta
    if (cardType === 'amex') {
      // AMEX: XXXX XXXXXX XXXXX
      for (let i = 0; i < cleanValue.length; i++) {
        if (i === 4 || i === 10) formattedValue += ' ';
        formattedValue += cleanValue[i];
      }
    } else {
      // Otros: XXXX XXXX XXXX XXXX
      for (let i = 0; i < cleanValue.length; i++) {
        if (i > 0 && i % 4 === 0) formattedValue += ' ';
        formattedValue += cleanValue[i];
      }
    }

    return formattedValue;
  };

  // Formatear fecha de expiración mientras se escribe
  const formatExpiryDate = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    let formattedValue = '';

    for (let i = 0; i < cleanValue.length; i++) {
      if (i === 2) formattedValue += '/';
      formattedValue += cleanValue[i];
    }

    return formattedValue;
  };

  // Detectar tipo de tarjeta mientras se escribe
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cleanValue = value.replace(/\D/g, '');
    const formattedValue = formatCardNumber(value);

    form.setValue('cardNumber', formattedValue, { shouldValidate: true });
    setCardType(detectCardType(cleanValue));
  };

  // Manejar cambios en la fecha de expiración
  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formattedValue = formatExpiryDate(value);
    form.setValue('expiryDate', formattedValue, { shouldValidate: true });
  };

  return (
    <Card className={`w-full max-w-md mx-auto shadow-sm ${className}`}>
      <CardHeader>
        <CardTitle>Información de pago</CardTitle>
        <CardDescription>
          Ingrese los datos de su tarjeta para completar el pago
        </CardDescription>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-6">
            {/* Resumen del pago */}
            <div className="rounded-lg bg-muted p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total a pagar:</span>
                <span className="text-xl font-bold">
                  {currency === 'EUR' ? '€' : '$'}
                  {amount.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Nombre del titular */}
            <FormField
              control={form.control}
              name="cardholderName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del titular</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nombre como aparece en la tarjeta"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Número de tarjeta */}
            <FormField
              control={form.control}
              name="cardNumber"
              render={({ field: { onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Número de tarjeta</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="1234 5678 9012 3456"
                        maxLength={cardType === 'amex' ? 18 : 19} // Incluye espacios
                        {...fieldProps}
                        onChange={handleCardNumberChange}
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <CardTypeIcon cardType={cardType as any} />
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Fecha de expiración y CVC */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="expiryDate"
                render={({ field: { onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>Fecha de expiración</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="MM/YY"
                        maxLength={5}
                        {...fieldProps}
                        onChange={handleExpiryDateChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cvc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CVC</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={
                          cardType === 'amex' ? '4 dígitos' : '3 dígitos'
                        }
                        maxLength={cardType === 'amex' ? 4 : 3}
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Guardar tarjeta */}
            {showSaveCardOption && (
              <FormField
                control={form.control}
                name="saveCard"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Guardar tarjeta para futuros pagos</FormLabel>
                      <FormDescription>
                        Su información se almacenará de forma segura para
                        facilitar compras futuras.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            )}

            {/* Nota de seguridad */}
            <div className="flex items-center justify-center text-xs text-muted-foreground">
              <Lock className="h-3 w-3 mr-1" />
              <span>
                Sus datos están protegidos con encriptación SSL de 256 bits
              </span>
            </div>
          </CardContent>

          <CardFooter>
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <CreditCard className="mr-2 h-4 w-4 animate-pulse" />
                  Procesando pago...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Pagar {currency === 'EUR' ? '€' : '$'}
                  {amount.toFixed(2)}
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
