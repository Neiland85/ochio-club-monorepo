import { Request, Response, NextFunction } from "express";
import { UserRole } from "../models/user";

export function authorizeRoles(roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ error: "No tienes permisos suficientes" });
    }
    next();
  };
}
