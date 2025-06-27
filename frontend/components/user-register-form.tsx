'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, User, Mail, Lock, AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
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
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  userRegisterSchema,
  type UserRegisterFormValues,
  type UserRegisterFormProps,
  type PasswordStrength,
  type PasswordStrengthInfo,
} from '@/types/user-register';

// Función para evaluar la fortaleza de la contraseña
function evaluatePasswordStrength(password: string): PasswordStrengthInfo {
  let score = 0;
  const feedback: string[] = [];

  if (password.length >= 8) score += 1;
  else feedback.push('Al menos 8 caracteres');

  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('Una letra minúscula');

  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('Una letra mayúscula');

  if (/\d/.test(password)) score += 1;
  else feedback.push('Un número');

  if (/[^a-zA-Z\d]/.test(password)) score += 1;
  else feedback.push('Un carácter especial');

  let strength: PasswordStrength;
  let color: string;
  let bgColor: string;

  if (score <= 1) {
    strength = 'weak';
    color = 'text-red-600';
    bgColor = 'bg-red-100';
  } else if (score <= 2) {
    strength = 'fair';
    color = 'text-orange-600';
    bgColor = 'bg-orange-100';
  } else if (score <= 3) {
    strength = 'good';
    color = 'text-yellow-600';
    bgColor = 'bg-yellow-100';
  } else {
    strength = 'strong';
    color = 'text-green-600';
    bgColor = 'bg-green-100';
  }

  return { score, strength, feedback, color, bgColor };
}

export default function UserRegisterForm({
  onSubmit,
  isSubmitting = false,
  defaultValues,
  className = '',
  showPasswordStrength = true,
  redirectToLogin,
}: UserRegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<UserRegisterFormValues>({
    resolver: zodResolver(userRegisterSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
      ...defaultValues,
    },
  });

  const handleSubmit = async (data: UserRegisterFormValues) => {
    const { confirmPassword, acceptTerms, ...submitData } = data;
    await onSubmit(submitData);
  };

  // Observar la contraseña para mostrar la fortaleza
  const password = form.watch('password');
  const passwordStrength = password ? evaluatePasswordStrength(password) : null;

  const PasswordStrengthIndicator = () => {
    if (!showPasswordStrength || !password || !passwordStrength) return null;

    const strengthLabels = {
      weak: 'Débil',
      fair: 'Regular',
      good: 'Buena',
      strong: 'Fuerte',
    };

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span>Fortaleza de la contraseña:</span>
          <span className={`font-medium ${passwordStrength.color}`}>
            {strengthLabels[passwordStrength.strength]}
          </span>
        </div>
        <Progress value={(passwordStrength.score / 5) * 100} className="h-2" />
        {passwordStrength.feedback.length > 0 && (
          <div className="text-xs text-muted-foreground">
            <p>Falta:</p>
            <ul className="list-disc list-inside ml-2">
              {passwordStrength.feedback.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className={`w-full max-w-md mx-auto shadow-sm ${className}`}>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Crear cuenta</CardTitle>
        <CardDescription>
          Completa los datos para registrarte en Ochío Club
        </CardDescription>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-6">
            {/* Nombre */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre completo</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Ingrese su nombre completo"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="su.email@ejemplo.com"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Contraseña */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Ingrese su contraseña"
                        className="pl-10 pr-10"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={
                          showPassword
                            ? 'Ocultar contraseña'
                            : 'Mostrar contraseña'
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                  <PasswordStrengthIndicator />
                </FormItem>
              )}
            />

            {/* Confirmar contraseña */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar contraseña</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirme su contraseña"
                        className="pl-10 pr-10"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        aria-label={
                          showConfirmPassword
                            ? 'Ocultar contraseña'
                            : 'Mostrar contraseña'
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Términos y condiciones */}
            <FormField
              control={form.control}
              name="acceptTerms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-normal">
                      Acepto los{' '}
                      <a
                        href="/terminos"
                        className="text-primary hover:underline"
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        términos y condiciones
                      </a>{' '}
                      y la{' '}
                      <a
                        href="/privacidad"
                        className="text-primary hover:underline"
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        política de privacidad
                      </a>
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            {/* Información de seguridad */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                Tu información está protegida con encriptación de extremo a
                extremo. Nunca compartiremos tus datos personales.
              </AlertDescription>
            </Alert>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  Creando cuenta...
                </>
              ) : (
                <>
                  <User className="mr-2 h-4 w-4" />
                  Crear cuenta
                </>
              )}
            </Button>

            {redirectToLogin && (
              <div className="text-center text-sm text-muted-foreground">
                ¿Ya tienes una cuenta?{' '}
                <Button
                  variant="link"
                  className="p-0 h-auto font-normal"
                  onClick={redirectToLogin}
                >
                  Inicia sesión aquí
                </Button>
              </div>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
