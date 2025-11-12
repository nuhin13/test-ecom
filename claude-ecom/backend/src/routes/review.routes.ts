import { Router } from 'express';
import {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
} from '../controllers/review.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validator.middleware';
import { createReviewSchema, updateReviewSchema } from '../validators/review.validator';

const router = Router();

router.post('/', authenticate, validate(createReviewSchema), createReview);
router.get('/product/:productId', getProductReviews);
router.put('/:id', authenticate, validate(updateReviewSchema), updateReview);
router.delete('/:id', authenticate, deleteReview);

export default router;
