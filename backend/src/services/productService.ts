import { Product } from '../models/product';

const products: Product[] = [
  { id: '1', name: 'Producto 1', description: 'Desc 1', price: 10, stock: 5, createdAt: new Date() },
  { id: '2', name: 'Producto 2', description: 'Desc 2', price: 20, stock: 3, createdAt: new Date() }
];

export class ProductService {
  async getAllProducts(): Promise<Product[]> {
    return products;
  }
  async getProductById(id: string): Promise<Product | undefined> {
    return products.find(p => p.id === id);
  }
  async createProduct(data: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
    if (products.some(p => p.name === data.name)) {
      throw new Error('El producto ya existe');
    }

    const newProduct: Product = {
      ...data,
      id: (products.length + 1).toString(),
      createdAt: new Date()
    };
    products.push(newProduct);
    return newProduct;
  }
}