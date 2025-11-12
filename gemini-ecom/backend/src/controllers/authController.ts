import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: '30d',
  });
};

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id!.toString()),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password!))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id!.toString()),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// MOCKED OTP Login
export const loginWithOTP = async (req: Request, res: Response) => {
    const { phone, otp } = req.body;

    // **MOCK IMPLEMENTATION**
    // In a real app, you would use a service like Twilio to send and verify OTPs.
    // Here, we accept any OTP for a given phone number for demonstration.
    if (otp) {
        try {
            let user = await User.findOne({ phone });

            if (!user) {
                user = await User.create({
                    name: `User ${phone.slice(-4)}`,
                    email: `${phone}@bd-sourcing.com`, // Create a dummy email
                    phone,
                });
            }
            
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id!.toString()),
            });

        } catch (error) {
            res.status(500).json({ message: 'Server error during OTP login' });
        }
    } else {
        res.status(401).json({ message: 'Invalid OTP' });
    }
};


export const getMe = async (req: Request, res: Response) => {
  res.json(req.user);
};
