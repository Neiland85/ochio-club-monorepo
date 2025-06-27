import { supabaseClient } from "../config/supabaseClient";

export interface UserRepository {
  getUserByEmail(email: string): Promise<any>;
  registerUser(email: string, password: string): Promise<any>;
}

export const userRepository: UserRepository = {
  async getUserByEmail(email: string) {
    const { data, error } = await supabaseClient
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async registerUser(email: string, password: string) {
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },
};
