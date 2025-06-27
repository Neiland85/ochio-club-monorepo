import { Router } from "express";
import { ProductService } from "../services/productService";
import {
  getAllProducts,
  getProductById,
  createProduct,
} from "../controllers/productController";
import { z } from "zod";

const router = Router();
const productService = new ProductService();

// Esquema de validación para productos
const productSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().min(1, "La descripción es requerida"),
  price: z.number().positive("El precio debe ser positivo"),
  stock: z
    .number()
    .int()
    .nonnegative("El stock debe ser un número entero no negativo"),
});

router.get("/", getAllProducts(productService));
router.get("/:id", getProductById(productService));
router.post(
  "/",
  (req, res, next) => {
    try {
      const validatedData = productSchema.parse(req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Error desconocido" });
      }
    }
  },
  createProduct(productService),
);

export default router;
