// src/routes/userRoutes.ts
import { Router } from 'express';
import { UserService } from '../services/userService';
import { getAllUsers, createUser } from '../controllers/userController';
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

router.get('/', getAllUsers);
router.post('/', validateUserCreation, createUser(userService));
router.post('/login', login);

export default router;