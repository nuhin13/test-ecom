import { z } from 'zod';

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Product name is required').max(200),
    description: z.string().min(1, 'Description is required'),
    specifications: z.record(z.string()).optional(),
    category: z.string().min(1, 'Category is required'),
    price: z.number().min(0, 'Price must be non-negative'),
    discountedPrice: z.number().min(0).optional(),
    images: z.array(z.string().url()).min(1, 'At least one image is required'),
    video: z.string().url().optional(),
    stock: z.number().int().min(0, 'Stock must be non-negative'),
    isAvailable: z.boolean().optional(),
    deliveryEstimate: z
      .object({
        min: z.number().int().min(1),
        max: z.number().int().min(1),
        unit: z.enum(['days', 'weeks']),
      })
      .optional(),
    tags: z.array(z.string()).optional(),
    sku: z.string().min(1, 'SKU is required'),
  }),
});

export const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(200).optional(),
    description: z.string().min(1).optional(),
    specifications: z.record(z.string()).optional(),
    category: z.string().min(1).optional(),
    price: z.number().min(0).optional(),
    discountedPrice: z.number().min(0).optional(),
    images: z.array(z.string().url()).optional(),
    video: z.string().url().optional(),
    stock: z.number().int().min(0).optional(),
    isAvailable: z.boolean().optional(),
    deliveryEstimate: z
      .object({
        min: z.number().int().min(1),
        max: z.number().int().min(1),
        unit: z.enum(['days', 'weeks']),
      })
      .optional(),
    tags: z.array(z.string()).optional(),
  }),
  params: z.object({
    id: z.string().min(1, 'Product ID is required'),
  }),
});

export const getProductsSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    search: z.string().optional(),
    category: z.string().optional(),
    minPrice: z.string().optional(),
    maxPrice: z.string().optional(),
    minRating: z.string().optional(),
    available: z.string().optional(),
    sortBy: z.enum(['newest', 'price_asc', 'price_desc', 'rating']).optional(),
  }),
});
