import { Router } from 'express';
import { ProductService } from '../services/productService';
import { getAllProducts, getProductById, createProduct } from '../controllers/productController';

const router = Router();
const productService = new ProductService();

router.get('/', getAllProducts(productService));
router.get('/:id', getProductById(productService));
router.post('/', createProduct(productService));

export default router;