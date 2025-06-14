// src/controllers/userController.ts
import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { validationResult } from 'express-validator';

// Handler para obtener todos los usuarios
export const getAllUsers = (userService: UserService) => async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error al obtener usuarios' });
  }
};

// Handler para crear un nuevo usuario
export const createUser = (userService: UserService) => async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { email, password, role } = req.body;
  try {
    const user = await userService.createUser(email, password, role);
    const { passwordHash, ...userResponse } = user;
    res.status(201).json(userResponse);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Error al crear usuario' });
  }
};