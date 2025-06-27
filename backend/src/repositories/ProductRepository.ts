import { supabaseClient } from "../config/supabaseClient";

export interface ProductRepository {
  getAllProducts(): Promise<any>;
  createProduct(product: { name: string; price: number }): Promise<any>;
}

export const productRepository: ProductRepository = {
  async getAllProducts() {
    const { data, error } = await supabaseClient.from("products").select("*");

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async createProduct(product) {
    const { data, error } = await supabaseClient
      .from("products")
      .insert(product);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },
};
