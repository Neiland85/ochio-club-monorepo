// src/controllers/authController.ts
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const secret = process.env.SUPABASE_JWT_SECRET;

  if (!secret) {
    throw new Error('SUPABASE_JWT_SECRET no está definido en las variables de entorno');
  }

  const token = jwt.sign({ id: user.id }, secret, {
    expiresIn: '1h',
  });

  res.json({ token });
};