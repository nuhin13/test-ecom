import { Request, Response } from 'express';
import { User } from '../models/User';
import { sendOTP, verifyOTP } from '../utils/otpService';
import { generateToken, sanitizeUser } from '../utils/helpers';

export const sendPhoneOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone } = req.body;

    const result = await sendOTP(phone);

    if (!result.success) {
      res.status(500).json({
        success: false,
        message: result.message,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP',
    });
  }
};

export const verifyPhoneOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone, otp } = req.body;

    const result = verifyOTP(phone, otp);

    if (!result.valid) {
      res.status(400).json({
        success: false,
        message: result.message,
      });
      return;
    }

    // Find or create user
    let user = await User.findOne({ phone });

    if (!user) {
      user = await User.create({
        phone,
        name: `User ${phone.slice(-4)}`,
        provider: 'phone',
      });
    }

    const token = generateToken((user._id as any).toString());

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify OTP',
    });
  }
};

/**
 * Google OAuth login
 * In production, verify the Google token with Google's API
 */
export const googleLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token: _googleToken } = req.body;

    // TODO: Verify Google token with Google's API
    // For now, we'll mock the verification
    // const ticket = await client.verifyIdToken({ idToken: _googleToken });
    // const payload = ticket.getPayload();

    // Mock payload (replace with real verification in production)
    const mockPayload = {
      sub: 'google-user-id-' + Date.now(),
      email: 'user@example.com',
      name: 'Google User',
      picture: 'https://via.placeholder.com/150',
    };

    // Find or create user
    let user = await User.findOne({ provider: 'google', providerId: mockPayload.sub });

    if (!user) {
      user = await User.create({
        name: mockPayload.name,
        email: mockPayload.email,
        provider: 'google',
        providerId: mockPayload.sub,
        avatar: mockPayload.picture,
      });
    }

    const token = generateToken((user._id as any).toString());

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to authenticate with Google',
    });
  }
};

export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
      return;
    }

    res.status(200).json({
      success: true,
      user: sanitizeUser(req.user),
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user',
    });
  }
};

export const logout = async (_req: Request, res: Response): Promise<void> => {
  try {
    res.clearCookie('token');
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to logout',
    });
  }
};
