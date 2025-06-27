// src/controllers/userController.ts
import { Request, Response } from "express";
import { getUsers, addUser } from "../services/userService";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await getUsers();
    res.status(200).json(users);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const user = req.body;
    const newUser = await addUser(user);
    res.status(201).json(newUser);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
};
