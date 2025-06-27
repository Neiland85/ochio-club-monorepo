// src/routes/authRoutes.ts
import express from "express";
import { UserService } from "../services/userService";
import { login } from "../controllers/authController";
import { body } from "express-validator";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs"; // Importamos ParsedQs

const router = express.Router();
const userService = new UserService();

// Validation middleware for login
const validateLogin = [
  body("email").isEmail().withMessage("Email debe ser válido").normalizeEmail(),
  body("password").isLength({ min: 1 }).withMessage("Password es requerido"),
];

router.post(
  "/login",
  validateLogin,
  async (
    req: express.Request<
      ParamsDictionary,
      any,
      any,
      ParsedQs,
      Record<string, any>
    >,
    res: express.Response<any, Record<string, any>>,
  ) => {
    await login(req, res);
  },
);

export default router;
