// src/app.ts
import express, { Application, RequestHandler } from "express";
import cors from "cors";
import helmet from "helmet";
import { json, urlencoded } from "express";

// Importa middlewares personalizados
import errorHandler from "./middlewares/errorHandler";
import { authenticateJWT } from "./middlewares/authenticateJWT";
import { authorizeRoles } from "./middlewares/authorizeRoles";

// Importa rutas modulares
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/productRoutes";
import stockRoutes from "./routes/stockRoutes";

// Crea la app de Express
const app: Application = express();

// Middlewares globales
const globalMiddlewares: RequestHandler[] = [
  helmet(),
  cors(),
  json(),
  urlencoded({ extended: true }),
];

globalMiddlewares.forEach((mw) => app.use(mw));

// Ruta de salud/bienvenida
app.get("/", (req, res) => {
  res.send("OchioClub API funcionando");
});

// Rutas públicas
app.use("/api/auth", authRoutes);

// Middleware de autenticación para rutas protegidas
app.use(authenticateJWT);

// Rutas protegidas
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/stock", stockRoutes);

// Middleware de manejo de errores
app.use(errorHandler);

// Elimina la inicialización del servidor
// exporta solo la aplicación
export default app;
