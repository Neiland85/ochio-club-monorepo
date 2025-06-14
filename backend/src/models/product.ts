// Aquí irán los modelos de datos de productos
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  createdAt: Date;
}
