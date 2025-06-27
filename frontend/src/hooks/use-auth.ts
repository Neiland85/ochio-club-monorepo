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
  const router = useRouter();

  useEffect(() => {
    const mockUser: User = {
      id: 'u1',
      name: 'Admin User',
      role: 'admin',
    };
    setTimeout(() => {
      setUser(mockUser);
      setIsLoading(false);
    }, 1000);
  }, []);

  const logout = () => {
    setUser(null);
    router.push('/login');
  };

  return { user, isLoading, logout };
}
