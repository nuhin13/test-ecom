import express from 'express';
import {
  getProducts,
  getProductById,
  createProductReview,
  getProductReviews,
  getCategories,
} from '../controllers/productController';
import { protect } from '../middleware/authMiddleware';
import { validate } from '../middleware/validationMiddleware';
import { createReviewSchema } from '../utils/validators';

const router = express.Router();

router.route('/').get(getProducts);
router.route('/categories').get(getCategories);
router.route('/:id').get(getProductById);
router.route('/:id/reviews').get(getProductReviews).post(protect, validate(createReviewSchema), createProductReview);

export default router;
