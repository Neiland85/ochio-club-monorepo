'use client';

import { useState } from 'react';
import UserLoginForm from '@/components/user-login-form';
import type { UserLoginData } from '@/types/user-login';

export default function LoginFormExample() {
  const [state, setState] = useState({
    isLoading: false,
    error: '',
    loginSuccess: false,
  });

  const handleLogin = async (data: UserLoginData) => {
    setState((prev) => ({ ...prev, isLoading: true, error: '' }));

    try {
      // Simular llamada a API
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simular validación de credenciales
      if (
        (data.email === 'admin@ochio.com' && data.password === 'admin123') ||
        (data.email === 'user@ochio.com' && data.password === 'user123')
      ) {
        setState((prev) => ({ ...prev, loginSuccess: true }));
      } else {
        setState((prev) => ({
          ...prev,
          error: 'Email o contraseña incorrectos',
        }));
      }
    } catch {
      setState((prev) => ({
        ...prev,
        error: 'Error de conexión. Inténtalo de nuevo.',
      }));
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleForgotPassword = () => {
    alert('Funcionalidad de recuperación de contraseña');
  };

  const handleRegisterRedirect = () => {
    alert('Redireccionar a página de registro');
  };

  if (state.loginSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-4">
            ¡Login Exitoso!
          </h2>
          <p className="text-gray-600 mb-4">
            Has iniciado sesión correctamente.
          </p>
          <button
            onClick={() =>
              setState((prev) => ({ ...prev, loginSuccess: false }))
            }
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Volver al formulario
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <UserLoginForm
          onSubmit={handleLogin}
          isLoading={state.isLoading}
          error={state.error}
          onForgotPassword={handleForgotPassword}
          onRegisterRedirect={handleRegisterRedirect}
        />

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">
            Credenciales de prueba:
          </h3>
          <div className="text-sm text-blue-700 space-y-1">
            <p>
              <strong>Admin:</strong> admin@ochio.com / admin123
            </p>
            <p>
              <strong>Usuario:</strong> user@ochio.com / user123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
