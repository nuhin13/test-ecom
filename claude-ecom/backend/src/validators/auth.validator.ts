import { z } from 'zod';

export const sendOTPSchema = z.object({
  body: z.object({
    phone: z
      .string()
      .min(10, 'Phone number must be at least 10 digits')
      .max(15, 'Phone number must not exceed 15 digits')
      .regex(/^[0-9+\-\s()]+$/, 'Invalid phone number format'),
  }),
});

export const verifyOTPSchema = z.object({
  body: z.object({
    phone: z.string(),
    otp: z.string().length(6, 'OTP must be 6 digits'),
  }),
});

export const googleAuthSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Google token is required'),
  }),
});
