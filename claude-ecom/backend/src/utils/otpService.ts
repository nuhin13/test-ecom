import { config } from '../config/env';

/**
 * Mock OTP Service
 * In production, replace with real SMS service like Twilio, AWS SNS, etc.
 */

interface OTPStore {
  [phone: string]: {
    otp: string;
    expiresAt: Date;
  };
}

// In-memory storage for development (use Redis in production)
const otpStore: OTPStore = {};

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendOTP = async (phone: string): Promise<{ success: boolean; message: string }> => {
  if (!config.otpServiceEnabled) {
    return {
      success: false,
      message: 'OTP service is disabled',
    };
  }

  try {
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + config.otpExpiryMinutes * 60 * 1000);

    // Store OTP (in production, use Redis with TTL)
    otpStore[phone] = { otp, expiresAt };

    // Mock: Log OTP to console (in production, send via SMS)
    console.log(`[MOCK OTP] Phone: ${phone}, OTP: ${otp}, Expires: ${expiresAt}`);

    return {
      success: true,
      message: 'OTP sent successfully',
    };
  } catch (error) {
    console.error('Error sending OTP:', error);
    return {
      success: false,
      message: 'Failed to send OTP',
    };
  }
};

export const verifyOTP = (phone: string, otp: string): { valid: boolean; message: string } => {
  const stored = otpStore[phone];

  if (!stored) {
    return {
      valid: false,
      message: 'No OTP found for this phone number',
    };
  }

  if (new Date() > stored.expiresAt) {
    delete otpStore[phone];
    return {
      valid: false,
      message: 'OTP has expired',
    };
  }

  if (stored.otp !== otp) {
    return {
      valid: false,
      message: 'Invalid OTP',
    };
  }

  // Clear OTP after successful verification
  delete otpStore[phone];

  return {
    valid: true,
    message: 'OTP verified successfully',
  };
};

// Clean up expired OTPs periodically
setInterval(() => {
  const now = new Date();
  Object.keys(otpStore).forEach((phone) => {
    if (otpStore[phone].expiresAt < now) {
      delete otpStore[phone];
    }
  });
}, 60000); // Run every minute
