import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export function getDiscountPercentage(price: number, discountedPrice: number): number {
  return Math.round(((price - discountedPrice) / price) * 100);
}

export function getDeliveryText(estimate: { min: number; max: number; unit: string }): string {
  return `${estimate.min}-${estimate.max} ${estimate.unit}`;
}
