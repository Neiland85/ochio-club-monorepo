import { Router } from 'express';
import { authenticateJWT } from '../middlewares/authenticateJWT';

const router = Router();

// Middleware de autenticación
router.use(authenticateJWT);

// Endpoint para obtener datos de stock
router.get('/', (req, res) => {
  res.status(200).json({ stocks: [] });
});

export default router;
