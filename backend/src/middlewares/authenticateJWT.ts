import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import fs from 'fs';

const logStream = fs.createWriteStream('./authMiddlewareLogs.txt', { flags: 'a' });

export function authenticateJWT(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  console.log('Encabezado de autorización recibido:', authHeader);
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.error('Token no proporcionado o formato incorrecto:', authHeader);
    return res.status(401).json({ error: 'Token no proporcionado' });
  }
  const token = authHeader.split(' ')[1];
  console.log('Token recibido para verificación:', token);
  console.log('Secreto JWT utilizado:', config.jwtSecret);
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    console.log('Token decodificado:', decoded);
    if (!decoded || typeof decoded !== 'object' || !('id' in decoded) || !('role' in decoded)) {
      console.error('Token inválido:', decoded);
      return res.status(401).json({ error: 'Token inválido' });
    }
    (req as any).user = decoded;
    console.log('Usuario decodificado:', (req as any).user);
    logStream.write(`Encabezado de autorización recibido: ${authHeader}\n`);
    logStream.write(`Token extraído: ${token}\n`);
    logStream.write(`Secreto JWT utilizado: ${config.jwtSecret}\n`);
    logStream.write(`Decodificación del token: ${JSON.stringify(decoded)}\n`);
    next();
  } catch (err) {
    console.error('Error al verificar el token:', err);
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}
