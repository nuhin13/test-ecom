import express from 'express';
import {
  addOrderItems,
  getOrderById,
  getMyOrders,
} from '../controllers/orderController';
import { protect } from '../middleware/authMiddleware';
import { validate } from '../middleware/validationMiddleware';
import { createOrderSchema } from '../utils/validators';

const router = express.Router();

router.route('/').post(protect, validate(createOrderSchema), addOrderItems);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);

export default router;
