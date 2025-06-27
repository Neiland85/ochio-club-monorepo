import UserLoginForm from '@/components/user-login-form';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';
import type { UserLoginFormProps } from '@/types/user-login';

// Esquema de validación con zod
const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'El email es obligatorio' })
    .email({ message: 'Formato de email inválido' }),
  password: z
    .string()
    .min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function UserLoginForm({
  onSuccess,
  onError,
}: UserLoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setServerError(null);

      // Simulación de verificación de credenciales
      // En un caso real, esto sería una llamada a la API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Datos de ejemplo para diferentes roles
      let userData;

      if (data.email.includes('admin')) {
        userData = {
          id: 'u1',
          name: 'Ana García Martínez',
          email: data.email,
          role: 'admin',
          avatar: '/placeholder.svg?height=40&width=40&query=ana+garcia',
        };
      } else if (data.email.includes('baker')) {
        userData = {
          id: 'u2',
          name: 'Carlos Rodríguez López',
          email: data.email,
          role: 'baker',
          bakeryId: 'b1',
        };
      } else {
        userData = {
          id: 'u3',
          name: 'María Sánchez Moreno',
          email: data.email,
          role: 'customer',
        };
      }

      // Iniciar sesión con el hook de autenticación
      await login(userData);

      toast({
        title: 'Inicio de sesión exitoso',
        description: `Bienvenido/a, ${userData.name}`,
      });

      if (onSuccess) {
        onSuccess(userData);
      }
    } catch (error) {
      console.error('Error de inicio de sesión:', error);
      setServerError('Credenciales incorrectas. Inténtalo de nuevo.');

      if (onError) {
        onError(error as Error);
      }
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Iniciar Sesión
        </CardTitle>
        <CardDescription className="text-center">
          Ingresa tus credenciales para acceder a tu cuenta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                className="pl-10"
                {...register('email')}
                disabled={isSubmitting}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Contraseña</Label>
              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="pl-10"
                {...register('password')}
                disabled={isSubmitting}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isSubmitting}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          {serverError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
              {serverError}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Iniciando sesión...
              </>
            ) : (
              'Iniciar Sesión'
            )}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm">
          <p className="text-muted-foreground">
            Para probar diferentes roles, usa:
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            admin@example.com, baker@example.com, o user@example.com
          </p>
          <p className="text-xs text-muted-foreground">
            (cualquier contraseña funcionará)
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col">
        <div className="text-center w-full">
          <p className="text-sm text-muted-foreground">
            ¿No tienes una cuenta?{' '}
            <Link href="/register" className="text-primary hover:underline">
              Regístrate
            </Link>
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}
