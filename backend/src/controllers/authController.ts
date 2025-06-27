// src/controllers/authController.ts
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/UserRepository";

export const login =
  (userRepository: UserRepository) => async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
      const user = await userRepository.getUserByEmail(email);

      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const secret = process.env.SUPABASE_JWT_SECRET;

      if (!secret) {
        throw new Error(
          "SUPABASE_JWT_SECRET no está definido en las variables de entorno",
        );
      }

      const token = jwt.sign({ id: user.id }, secret, {
        expiresIn: "1h",
      });

      res.json({ token });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  };

export const registerUser =
  (userRepository: UserRepository) => async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email y contraseña son obligatorios" });
    }

    try {
      const user = await userRepository.registerUser(email, password);
      res
        .status(201)
        .json({ message: "Usuario registrado exitosamente", user });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  };
