import { UserRepository } from "../../repositories/UserRepository";
import jwt from "jsonwebtoken";

export class AuthenticateUser {
  constructor(private userRepository: UserRepository) {}

  async execute(email: string, password: string): Promise<string> {
    const user = await this.userRepository.getUserByEmail(email);

    if (!user || user.password !== password) {
      throw new Error("Invalid credentials");
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

    return token;
  }
}
