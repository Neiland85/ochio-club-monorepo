import { Request, Response, NextFunction } from 'express';

export default function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('Error:', err); // Registro del error en la consola
  res.status(err.status || 500).json({
    error: err.message || 'Error interno',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined, // Mostrar stack solo en desarrollo
  });
}