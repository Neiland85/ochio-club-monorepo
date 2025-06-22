// src/controllers/userController.ts
import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { validationResult } from 'express-validator';

const userService = new UserService();

// Handler para obtener todos los usuarios
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ message: errorMessage });
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
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Error al crear usuario';
    res.status(400).json({ error: errorMessage });
  }
};