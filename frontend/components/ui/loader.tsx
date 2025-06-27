'use client';

import { Loader2 } from 'lucide-react';
import type {
  LoaderProps,
  LoaderSize,
  LoaderVariant,
} from '@/types/ui-components';

const sizeConfig: Record<
  LoaderSize,
  { spinner: string; text: string; container: string }
> = {
  sm: {
    spinner: 'h-4 w-4',
    text: 'text-sm',
    container: 'gap-2',
  },
  md: {
    spinner: 'h-6 w-6',
    text: 'text-base',
    container: 'gap-3',
  },
  lg: {
    spinner: 'h-8 w-8',
    text: 'text-lg',
    container: 'gap-4',
  },
  xl: {
    spinner: 'h-12 w-12',
    text: 'text-xl',
    container: 'gap-4',
  },
};

const variantConfig: Record<LoaderVariant, string> = {
  default: 'text-muted-foreground',
  primary: 'text-primary',
  secondary: 'text-secondary-foreground',
  destructive: 'text-destructive',
};

export default function Loader({
  size = 'md',
  variant = 'default',
  className = '',
  text,
  fullScreen = false,
}: LoaderProps) {
  const sizeClasses = sizeConfig[size];
  const variantClass = variantConfig[variant];

  const loaderContent = (
    <div
      className={`flex flex-col items-center justify-center ${sizeClasses.container} ${className}`}
    >
      <Loader2
        className={`animate-spin ${sizeClasses.spinner} ${variantClass}`}
      />
      {text && (
        <p className={`${sizeClasses.text} ${variantClass} font-medium`}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        {loaderContent}
      </div>
    );
  }

  return loaderContent;
}
