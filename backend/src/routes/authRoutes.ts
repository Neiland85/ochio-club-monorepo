// src/routes/authRoutes.ts
import { Router } from 'express';
import { UserService } from '../services/userService';
import { login } from '../controllers/authController';
import { body } from 'express-validator';

const router = Router();
const userService = new UserService();

// Validation middleware for login
const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Email debe ser válido')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 1 })
    .withMessage('Password es requerido')
];

router.post('/login', validateLogin, login(userService));

export default router;