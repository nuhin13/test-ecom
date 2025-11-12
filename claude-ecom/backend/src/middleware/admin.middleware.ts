import { Request, Response, NextFunction } from 'express';
import { config } from '../config/env';

export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  // Check if user is authenticated
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'Authentication required.',
    });
    return;
  }

  // Check if user is admin
  if (req.user.role !== 'admin') {
    res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.',
    });
    return;
  }

  next();
};

// Alternative: Check admin secret for script operations
export const requireAdminSecret = (req: Request, res: Response, next: NextFunction): void => {
  const adminSecret = req.headers['x-admin-secret'] as string;

  if (!adminSecret || adminSecret !== config.adminSecret) {
    res.status(403).json({
      success: false,
      message: 'Invalid admin credentials.',
    });
    return;
  }

  next();
};
