'use client';

import UserLoginForm from '../../components/user-login-form';
import AppLayout from '../../components/layout/app-layout';
import { useAuth } from '../../hooks/use-auth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { NavigationItem } from '../../types/layout';

// Elementos de navegación para usuarios no logueados
const publicNavItems: NavigationItem[] = [
  { label: 'Productos', href: '/productos', isActive: false },
  { label: 'Sobre Nosotros', href: '/nosotros', isActive: false },
  { label: 'Contacto', href: '/contacto', isActive: false },
]; // Cerramos el arreglo correctamente

export default function LoginPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (!isLoading && user) {
      if (user.role === 'admin') {
        router.push('/admin');
      } else if (user.role === 'baker') {
        router.push('/baker');
      } else {
        router.push('/user');
      }
    }
  }, [isLoading, user, router]);

  const handleLogin = async () => {
    try {
      // Reemplazar lógica de login con una implementación alternativa
      console.log('Iniciar sesión: Implementar lógica de autenticación aquí');
      alert('Login exitoso (simulado)');
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error al iniciar sesión:', error.message);
      } else {
        console.error('Error desconocido al iniciar sesión:', error);
      }
    }
  };

  return (
    <AppLayout navigationItems={publicNavItems}>
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <UserLoginForm
          onSuccess={(user: any) => {
            console.log('Login exitoso:', user);
          }}
          onError={(error: any) => {
            console.error('Error en login:', error);
          }}
        />
        <button onClick={handleLogin}>Iniciar sesión</button>
      </div>
    </AppLayout>
  );
}
