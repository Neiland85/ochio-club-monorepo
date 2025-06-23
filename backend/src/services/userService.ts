// Aquí irán los servicios de negocio (ejemplo de usuario)
import { User, UserRole } from '../models/user';
import bcrypt from 'bcryptjs';
import { supabase } from '../config/supabase';

const adminUser: User = {
  id: 'admin-1',
  email: 'admin@ochio.club',
  passwordHash: bcrypt.hashSync('123456', 10),
  role: 'admin' as UserRole,
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
};

// Store users in memory for now (in production would be a database)
const users: User[] = [adminUser];

export class UserService {
  async getAllUsers(): Promise<User[]> {
    // Devuelve todos los usuarios sin password hash por seguridad
    return users.map(user => ({
      id: user.id,
      email: user.email,
      passwordHash: '', // No exponer hash en listados
      role: user.role,
      createdAt: user.createdAt
    }));
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = users.find(u => u.email === email);
    console.log('Buscando usuario por email:', email);
    console.log('Usuario encontrado:', user);
    if (!user) {
      console.error('Usuario no encontrado:', email);
    }
    return user || null;
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    console.log('Validando contraseña para el usuario:', user.email);
    const isValid = await bcrypt.compare(password, user.passwordHash);
    console.log('Resultado de la validación de contraseña:', isValid);
    return isValid;
  }

  async createUser(email: string, password: string, role: UserRole = 'artesano'): Promise<User> {
    if (!email || !password) {
      throw new Error('Email y contraseña son obligatorios');
    }
    
    // Check if user already exists
    if (users.some(u => u.email === email)) {
      throw new Error('El email ya está registrado');
    }
    const newUser: User = {
      id: (users.length + 1).toString(),
      email,
      passwordHash: bcrypt.hashSync(password, 10),
      role,
      createdAt: new Date()
    };
    users.push(newUser);
    return newUser;
  }
}

export const getUserByEmail = async (email: string) => {
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return user;
};
