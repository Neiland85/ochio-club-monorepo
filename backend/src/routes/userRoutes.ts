// src/routes/userRoutes.ts
import { Router } from "express";
import { UserService } from "../services/userService";
import * as userController from "../controllers/userController";
import { z } from "zod";

const router = Router();
const userService = new UserService();

// Esquema de validación para usuarios
const userSchema = z.object({
  email: z.string().email("El email debe ser válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  role: z.enum(["admin", "artesano"]).optional(),
});

router.get("/", (req, res) => userController.getAllUsers(req, res));
router.post(
  "/",
  (req, res, next) => {
    try {
      const validatedData = userSchema.parse(req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      res.status(400).json({ error: error.errors });
    }
  },
  userController.createUser(userService),
);

export default router;
