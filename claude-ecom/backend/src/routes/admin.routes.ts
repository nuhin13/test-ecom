import { Router } from 'express';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  updateOrderStatus,
  getAllUsers,
  updateUserRole,
  createSlider,
  getSliders,
  updateSlider,
  deleteSlider,
} from '../controllers/admin.controller';
import { requireAdminSecret } from '../middleware/admin.middleware';
import { validate } from '../middleware/validator.middleware';
import { createProductSchema, updateProductSchema } from '../validators/product.validator';
import { updateOrderStatusSchema } from '../validators/order.validator';

const router = Router();

// All admin routes require admin secret
router.use(requireAdminSecret);

// Product management
router.post('/products', validate(createProductSchema), createProduct);
router.put('/products/:id', validate(updateProductSchema), updateProduct);
router.delete('/products/:id', deleteProduct);

// Order management
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', validate(updateOrderStatusSchema), updateOrderStatus);

// User management
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);

// Slider management
router.post('/sliders', createSlider);
router.get('/sliders', getSliders);
router.put('/sliders/:id', updateSlider);
router.delete('/sliders/:id', deleteSlider);

export default router;
