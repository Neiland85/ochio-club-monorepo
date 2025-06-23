// src/routes/userRoutes.ts
import { Router } from 'express';
import { UserService } from '../services/userService';
import * as userController from '../controllers/userController';
import { body } from 'express-validator';

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

router.get('/', userController.getAllUsers(userService));

export default router;