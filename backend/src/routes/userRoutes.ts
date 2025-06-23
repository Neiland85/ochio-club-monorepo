// src/routes/userRoutes.ts
import { Router } from 'express';
import { UserService } from '../services/userService';
import * as userController from '../controllers/userController';
import { body } from 'express-validator';
import express from 'express';
import { login } from '../controllers/authController';

const router = Router();
const userService = new UserService();

// Validation middleware for user creation
const validateUserCreation = [
  body('email')
    .isEmail()
    .withMessage('Email debe ser válido')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password debe tener al menos 6 caracteres'),
  body('role')
    .optional()
    .isIn(['admin', 'artesano'])
    .withMessage('Role debe ser admin o artesano')
];

router.get('/', (req, res) => userController.getAllUsers(req, res));

export default router;

function createUser(userService: UserService): express.RequestHandler {
  return async (req, res) => {
    try {
      const { email, password, role } = req.body;
      const newUser = await userService.createUser(email, password, role);
      res.status(201).json({ message: 'Usuario creado exitosamente', user: newUser });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: 'Error al crear usuario', error: error.message });
      } else {
        res.status(500).json({ message: 'Error al crear usuario', error: 'Error desconocido' });
      }
    }
  };
}
