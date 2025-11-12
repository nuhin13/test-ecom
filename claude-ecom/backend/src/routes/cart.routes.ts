import { Router } from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  mergeCart,
} from '../controllers/cart.controller';
import { optionalAuthenticate, authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', optionalAuthenticate, getCart);
router.post('/add', optionalAuthenticate, addToCart);
router.put('/update', optionalAuthenticate, updateCartItem);
router.delete('/remove/:productId', optionalAuthenticate, removeFromCart);
router.delete('/clear', optionalAuthenticate, clearCart);
router.post('/merge', authenticate, mergeCart);

export default router;
