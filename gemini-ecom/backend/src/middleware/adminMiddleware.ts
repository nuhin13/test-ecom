import { Request, Response, NextFunction } from 'express';

export const admin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && (req.user.role === 'admin' || req.user.id === process.env.ADMIN_USER_ID)) {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};
