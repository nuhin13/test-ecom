import { Router } from 'express';
import {
  getProducts,
  getProductById,
  getCategories,
  getTopRatedProducts,
  getProductsByCategory,
} from '../controllers/product.controller';
import { validate } from '../middleware/validator.middleware';
import { getProductsSchema } from '../validators/product.validator';

const router = Router();

router.get('/', validate(getProductsSchema), getProducts);
router.get('/categories', getCategories);
router.get('/top-rated', getTopRatedProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProductById);

export default router;
