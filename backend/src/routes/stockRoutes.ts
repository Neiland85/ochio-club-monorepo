import { Router } from "express";
import { authenticateJWT } from "../middlewares/authenticateJWT";
import { supabaseClient } from "../config/supabaseClient";

const router = Router();

// Middleware de autenticación
router.use(authenticateJWT);

// Endpoint para obtener datos de stock
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabaseClient.from("stocks").select("*");

    if (error) {
      return res.status(500).json({ error: "Error al obtener datos de stock" });
    }

    res.status(200).json({ stocks: data });
  } catch (err) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
