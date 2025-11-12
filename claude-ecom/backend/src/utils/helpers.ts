import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config/env';
import { IUser } from '../models/User';

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, config.jwtSecret, { expiresIn: config.jwtExpiry } as any);
};

export const sanitizeUser = (user: IUser) => {
  const { password, ...sanitizedUser } = user.toObject();
  return sanitizedUser;
};

export const calculatePagination = (page: number, limit: number, total: number) => {
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    currentPage: page,
    totalPages,
    totalItems: total,
    itemsPerPage: limit,
    hasNextPage,
    hasPrevPage,
  };
};

export const calculateShippingCost = (totalAmount: number): number => {
  // Free shipping over $50
  if (totalAmount >= 50) {
    return 0;
  }
  // Flat rate shipping
  return 5.99;
};

export const estimateDeliveryDate = (days: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};
