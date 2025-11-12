import { z } from 'zod';

export const createReviewSchema = z.object({
  body: z.object({
    product: z.string().min(1, 'Product ID is required'),
    rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
    comment: z.string().min(1, 'Comment is required').max(1000, 'Comment must not exceed 1000 characters'),
    images: z.array(z.string().url()).optional(),
  }),
});

export const updateReviewSchema = z.object({
  body: z.object({
    rating: z.number().int().min(1).max(5).optional(),
    comment: z.string().min(1).max(1000).optional(),
    images: z.array(z.string().url()).optional(),
  }),
  params: z.object({
    id: z.string().min(1, 'Review ID is required'),
  }),
});
