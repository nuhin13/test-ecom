'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { cartAPI } from '@/lib/api';
import { Cart } from '@/types';
import { formatPrice } from '@/lib/utils';
import { Trash2, Plus, Minus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await cartAPI.get();
      if (res.data.success && res.data.data) {
        setCart(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: string, newQuantity: number) => {
    try {
      if (newQuantity < 1) {
        await handleRemove(productId);
        return;
      }

      const res = await cartAPI.update(productId, newQuantity);
      if (res.data.success && res.data.data) {
        setCart(res.data.data);
        toast.success('Cart updated');
      }
    } catch (_error) {
      toast.error('Failed to update cart');
    }
  };

  const handleRemove = async (productId: string) => {
    try {
      await cartAPI.remove(productId);
      await fetchCart();
      toast.success('Item removed from cart');
    } catch (_error) {
      toast.error('Failed to remove item');
    }
  };

  const calculateSubtotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((sum, item) => {
      const price = item.product.discountedPrice || item.product.price;
      return sum + price * item.quantity;
    }, 0);
  };

  const calculateShipping = (subtotal: number) => {
    return subtotal >= 50 ? 0 : 5.99;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container text-center">
          <h1 className="mb-4 text-3xl font-bold">Your Cart is Empty</h1>
          <p className="mb-8 text-gray-600">Add some products to get started</p>
          <Link href="/products" className="btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = calculateSubtotal();
  const shipping = calculateShipping(subtotal);
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container">
        <h1 className="mb-8 text-3xl font-bold">Shopping Cart</h1>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="card">
              {cart.items.map((item) => (
                <div
                  key={item.product._id}
                  className="flex gap-4 border-b py-4 last:border-b-0"
                >
                  <img
                    src={item.product.images[0] || 'https://via.placeholder.com/100'}
                    alt={item.product.name}
                    className="h-24 w-24 rounded-md object-cover"
                  />

                  <div className="flex-1">
                    <Link
                      href={`/products/${item.product._id}`}
                      className="font-semibold hover:text-primary-600"
                    >
                      {item.product.name}
                    </Link>
                    <p className="mt-1 text-sm text-gray-600">{item.product.category}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="font-bold text-primary-600">
                        {formatPrice(item.product.discountedPrice || item.product.price)}
                      </span>
                      {item.product.discountedPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          {formatPrice(item.product.price)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => handleRemove(item.product._id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                        className="rounded-md border p-1 hover:bg-gray-100"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                        className="rounded-md border p-1 hover:bg-gray-100"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card sticky top-20">
              <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>

              <div className="space-y-3 border-b pb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
                </div>
                {subtotal < 50 && (
                  <p className="text-sm text-green-600">
                    Add {formatPrice(50 - subtotal)} more for free shipping!
                  </p>
                )}
              </div>

              <div className="flex justify-between py-4 text-lg font-bold">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>

              <Link href="/checkout" className="btn-primary w-full">
                Proceed to Checkout
              </Link>

              <Link href="/products" className="btn-secondary mt-3 w-full">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
