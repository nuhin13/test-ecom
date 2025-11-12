import express from 'express';
import { registerUser, loginUser, getMe, loginWithOTP } from '../controllers/authController';
import { validate } from '../middleware/validationMiddleware';
import { registerSchema, loginSchema } from '../utils/validators';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', validate(registerSchema), registerUser);
router.post('/login', validate(loginSchema), loginUser);
router.post('/login-otp', loginWithOTP); // MOCKED
router.get('/me', protect, getMe);

export default router;
