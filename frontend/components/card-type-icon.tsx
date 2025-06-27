'use client';

import { CreditCard } from 'lucide-react';
import type { CardType } from '@/types/payment-form';

interface CardTypeIconProps {
  cardType: CardType;
  className?: string;
}

export default function CardTypeIcon({
  cardType,
  className = '',
}: CardTypeIconProps) {
  // En un caso real, aquí usarías SVGs o imágenes para cada tipo de tarjeta
  // Por simplicidad, usamos texto y colores diferentes

  const getCardTypeDisplay = () => {
    switch (cardType) {
      case 'visa':
        return { text: 'VISA', color: 'text-blue-600' };
      case 'mastercard':
        return { text: 'MC', color: 'text-red-600' };
      case 'amex':
        return { text: 'AMEX', color: 'text-green-600' };
      case 'discover':
        return { text: 'DISC', color: 'text-orange-600' };
      case 'diners':
        return { text: 'DC', color: 'text-blue-400' };
      case 'jcb':
        return { text: 'JCB', color: 'text-green-500' };
      case 'unionpay':
        return { text: 'UP', color: 'text-red-500' };
      default:
        return { text: '', color: 'text-gray-400' };
    }
  };

  const { text, color } = getCardTypeDisplay();

  if (cardType === 'unknown') {
    return <CreditCard className={`h-5 w-5 text-gray-400 ${className}`} />;
  }

  return (
    <span className={`font-bold text-sm ${color} ${className}`}>{text}</span>
  );
}
