<<<<<<< HEAD
import { useState, useEffect } from 'react';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular una llamada a la API para verificar la autenticación
    setTimeout(() => {
=======
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  role: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Simular la carga de datos de usuario
    const mockUser: User = {
      id: "u1",
      name: "Admin User",
      role: "admin",
    };
    setTimeout(() => {
      setUser(mockUser);
>>>>>>> dev
      setIsLoading(false);
    }, 1000);
  }, []);

<<<<<<< HEAD
  const login = (userData: any) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return { isAuthenticated, user, isLoading, login, logout };
=======
  const logout = () => {
    setUser(null);
    router.push("/login");
  };

  return { user, isLoading, logout };
>>>>>>> dev
}
