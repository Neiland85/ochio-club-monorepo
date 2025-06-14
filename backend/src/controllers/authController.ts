// src/controllers/authController.ts
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { UserService } from '../services/userService';
import { validationResult } from 'express-validator';

// Ahora login es una función que recibe el servicio y retorna el handler
export const login = (userService: UserService) => async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  const user = await userService.findByEmail(email);
  if (!user) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }
  const isValid = await userService.validatePassword(user, password);
  if (!isValid) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }
  try {
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: '1h' }
    );
    res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error al iniciar sesión' });
  }
}; 