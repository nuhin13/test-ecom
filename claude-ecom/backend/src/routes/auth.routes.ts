import { Router } from 'express';
import {
  sendPhoneOTP,
  verifyPhoneOTP,
  googleLogin,
  getCurrentUser,
  logout,
} from '../controllers/auth.controller';
import { validate } from '../middleware/validator.middleware';
import { sendOTPSchema, verifyOTPSchema, googleAuthSchema } from '../validators/auth.validator';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/otp/send', validate(sendOTPSchema), sendPhoneOTP);
router.post('/otp/verify', validate(verifyOTPSchema), verifyPhoneOTP);
router.post('/google', validate(googleAuthSchema), googleLogin);
router.get('/me', authenticate, getCurrentUser);
router.post('/logout', logout);

export default router;
