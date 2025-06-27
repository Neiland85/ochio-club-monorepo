import { Product } from "../entities/Product";
import { ProductRepository } from "../../repositories/ProductRepository";

export class AddProduct {
  constructor(private productRepository: ProductRepository) {}

  async execute(productData: {
    name: string;
    price: number;
  }): Promise<Product> {
    const product = new Product(
      Math.random().toString(36).substring(2), // Generar un ID único
      productData.name,
      productData.price,
    );

    await this.productRepository.createProduct(product);
    return product;
  }
}
