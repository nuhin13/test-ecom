import { z } from 'zod';

// Auth
export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

// Product
export const createReviewSchema = z.object({
  body: z.object({
    rating: z.number().min(1).max(5),
    comment: z.string().min(5, 'Comment must be at least 5 characters'),
  }),
  params: z.object({
    id: z.string().refine((val) => /^[0-9a-fA-F]{24}$/.test(val), 'Invalid Product ID'),
  }),
});

// Order
export const createOrderSchema = z.object({
  body: z.object({
    items: z.array(
      z.object({
        productId: z.string().refine((val) => /^[0-9a-fA-F]{24}$/.test(val), 'Invalid Product ID'),
        quantity: z.number().min(1),
      })
    ).min(1, 'Order must have at least one item'),
    shippingAddress: z.object({
      street: z.string().min(1),
      city: z.string().min(1),
      zip: z.string().min(1),
      country: z.string().min(1),
    }),
  }),
});

// Admin Schemas
export const productCreateSchema = z.object({
    body: z.object({
        name: z.string().min(1),
        description: z.string().min(1),
        price: z.number().positive(),
        category: z.string().refine((val) => /^[0-9a-fA-F]{24}$/.test(val), 'Invalid Category ID'),
        stock: z.number().int().min(0),
        images: z.array(z.string().url()).min(1),
    })
});

export const categoryCreateSchema = z.object({
    body: z.object({
        name: z.string().min(2),
        slug: z.string().min(2),
        image: z.string().url(),
    })
});
