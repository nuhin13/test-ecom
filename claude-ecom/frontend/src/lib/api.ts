import axios from 'axios';
import type { ApiResponse, Product, Cart, Order, Review, User, Slider } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:10001/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  sendOTP: (phone: string) => api.post('/auth/otp/send', { phone }),
  verifyOTP: (phone: string, otp: string) =>
    api.post<ApiResponse<{ token: string; user: User }>>('/auth/otp/verify', { phone, otp }),
  googleLogin: (token: string) =>
    api.post<ApiResponse<{ token: string; user: User }>>('/auth/google', { token }),
  getCurrentUser: () => api.get<ApiResponse<User>>('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

// Products API
export const productsAPI = {
  getAll: (params?: Record<string, any>) =>
    api.get<ApiResponse<Product[]>>('/products', { params }),
  getById: (id: string) => api.get<ApiResponse<Product>>(`/products/${id}`),
  getCategories: () => api.get<ApiResponse<string[]>>('/products/categories'),
  getTopRated: (limit = 10) =>
    api.get<ApiResponse<Product[]>>('/products/top-rated', { params: { limit } }),
  getByCategory: (category: string, limit = 10) =>
    api.get<ApiResponse<Product[]>>(`/products/category/${category}`, { params: { limit } }),
};

// Cart API
export const cartAPI = {
  get: () => api.get<ApiResponse<Cart>>('/cart'),
  add: (productId: string, quantity = 1) =>
    api.post<ApiResponse<Cart>>('/cart/add', { productId, quantity }),
  update: (productId: string, quantity: number) =>
    api.put<ApiResponse<Cart>>('/cart/update', { productId, quantity }),
  remove: (productId: string) => api.delete<ApiResponse<void>>(`/cart/remove/${productId}`),
  clear: () => api.delete<ApiResponse<void>>('/cart/clear'),
  merge: (sessionId: string) => api.post<ApiResponse<Cart>>('/cart/merge', { sessionId }),
};

// Orders API
export const ordersAPI = {
  create: (data: {
    items: Array<{ product: string; quantity: number }>;
    shippingAddress: any;
    paymentMethod?: string;
    notes?: string;
  }) => api.post<ApiResponse<Order>>('/orders', data),
  getUserOrders: (params?: { page?: number; limit?: number }) =>
    api.get<ApiResponse<Order[]>>('/orders', { params }),
  getById: (id: string) => api.get<ApiResponse<Order>>(`/orders/${id}`),
  cancel: (id: string, reason: string) =>
    api.put<ApiResponse<Order>>(`/orders/${id}/cancel`, { reason }),
};

// Reviews API
export const reviewsAPI = {
  create: (data: { product: string; rating: number; comment: string; images?: string[] }) =>
    api.post<ApiResponse<Review>>('/reviews', data),
  getProductReviews: (productId: string, params?: { page?: number; limit?: number; sortBy?: string }) =>
    api.get<ApiResponse<Review[]>>(`/reviews/product/${productId}`, { params }),
  update: (id: string, data: { rating?: number; comment?: string; images?: string[] }) =>
    api.put<ApiResponse<Review>>(`/reviews/${id}`, data),
  delete: (id: string) => api.delete<ApiResponse<void>>(`/reviews/${id}`),
};

// User API
export const userAPI = {
  getProfile: () => api.get<ApiResponse<User>>('/users/profile'),
  updateProfile: (data: Partial<User>) => api.put<ApiResponse<User>>('/users/profile', data),
};

// Admin API (requires admin secret in header)
export const adminAPI = {
  createProduct: (data: Partial<Product>, adminSecret: string) =>
    api.post<ApiResponse<Product>>('/admin/products', data, {
      headers: { 'x-admin-secret': adminSecret },
    }),
  updateProduct: (id: string, data: Partial<Product>, adminSecret: string) =>
    api.put<ApiResponse<Product>>(`/admin/products/${id}`, data, {
      headers: { 'x-admin-secret': adminSecret },
    }),
  deleteProduct: (id: string, adminSecret: string) =>
    api.delete<ApiResponse<void>>(`/admin/products/${id}`, {
      headers: { 'x-admin-secret': adminSecret },
    }),
  getSliders: (adminSecret: string) =>
    api.get<ApiResponse<Slider[]>>('/admin/sliders', {
      headers: { 'x-admin-secret': adminSecret },
    }),
};

export default api;
