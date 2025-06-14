// Aquí irán los servicios de negocio (ejemplo de usuario)
import { User, UserRole } from '../models/user';
import bcrypt from 'bcryptjs';

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
    return user || null;
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.passwordHash);
  }

  async createUser(email: string, password: string, role: UserRole = 'artesano'): Promise<User> {
    if (!email || !password) {
      throw new Error('Email y contraseña son obligatorios');
    }
    
    // Check if user already exists
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new Error('El usuario ya existe');
    }
    
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser: User = {
      id: Math.random().toString(36).substring(2, 10),
      email,
      passwordHash,
      role,
      createdAt: new Date(),
    };
    
    users.push(newUser);
    return newUser;
  }
}
