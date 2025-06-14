// Aquí irán los modelos de datos (ejemplo con usuario)
export type UserRole = 'admin' | 'artesano';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
}
