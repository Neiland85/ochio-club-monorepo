import { Request, Response } from 'express';
import { ProductService } from '../services/productService';

export const getAllProducts = (productService: ProductService) => async (req: Request, res: Response) => {
  const products = await productService.getAllProducts();
  res.json(products);
};

export const getProductById = (productService: ProductService) => async (req: Request, res: Response) => {
  const product = await productService.getProductById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
};

export const createProduct = (productService: ProductService) => async (req: Request, res: Response) => {
  const { name, description, price, stock } = req.body;
  if (!name || !description || price == null || stock == null) {
    return res.status(400).json({ error: 'Datos inválidos' });
  }
  const product = await productService.createProduct({
    name, description, price, stock,
  });
  res.status(201).json(product);
};