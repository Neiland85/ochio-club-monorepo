import { supabaseClient } from '../config/supabaseClient';
import { Product } from '../models/product';

export class ProductService {
  async getAllProducts(): Promise<Product[]> {
    const { data, error } = await supabaseClient
      .from('products')
      .select('*');

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  async getProductById(id: string): Promise<Product | undefined> {
    const { data, error } = await supabaseClient
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async createProduct(data: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
    const { data: newProduct, error } = await supabaseClient
      .from('products')
      .insert([{ ...data, createdAt: new Date() }])
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return newProduct;
  }
}