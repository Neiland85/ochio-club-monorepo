import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  role: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const mockUser: User = {
      id: 'u1',
      name: 'Admin User',
      role: 'admin',
    };
    setTimeout(() => {
      setUser(mockUser);
      setIsAuthenticated(true);
      setIsLoading(false);
    }, 1000);
  }, []);

  const login = (userData: User) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    router.push('/login');
  };

  return { user, isLoading, isAuthenticated, login, logout };
}
