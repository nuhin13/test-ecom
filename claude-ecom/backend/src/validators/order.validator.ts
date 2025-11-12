import { z } from 'zod';

export const createOrderSchema = z.object({
  body: z.object({
    items: z
      .array(
        z.object({
          product: z.string().min(1, 'Product ID is required'),
          quantity: z.number().int().min(1, 'Quantity must be at least 1'),
        })
      )
      .min(1, 'At least one item is required'),
    shippingAddress: z.object({
      name: z.string().min(1, 'Name is required'),
      phone: z.string().min(10, 'Valid phone number is required'),
      street: z.string().min(1, 'Street address is required'),
      city: z.string().min(1, 'City is required'),
      state: z.string().min(1, 'State is required'),
      zipCode: z.string().min(1, 'Zip code is required'),
      country: z.string().min(1, 'Country is required'),
    }),
    paymentMethod: z.enum(['mock', 'stripe', 'cod']).optional(),
    notes: z.string().optional(),
  }),
});

export const updateOrderStatusSchema = z.object({
  body: z.object({
    status: z.enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']),
    trackingNumber: z.string().optional(),
    cancellationReason: z.string().optional(),
  }),
  params: z.object({
    id: z.string().min(1, 'Order ID is required'),
  }),
});
