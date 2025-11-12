'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { productsAPI } from '@/lib/api';
import { Product } from '@/types';
import { Truck, Shield, HeadphonesIcon, RotateCcw } from 'lucide-react';

export default function HomePage() {
  const [topRatedProducts, setTopRatedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          productsAPI.getTopRated(8),
          productsAPI.getCategories(),
        ]);

        if (productsRes.data.success && productsRes.data.data) {
          setTopRatedProducts(productsRes.data.data);
        }

        if (categoriesRes.data.success && categoriesRes.data.data) {
          setCategories(categoriesRes.data.data.slice(0, 6));
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 py-20 text-white">
        <div className="container">
          <div className="max-w-2xl">
            <h1 className="mb-4 text-5xl font-bold">Welcome to BD-Sourcing</h1>
            <p className="mb-8 text-xl">
              Quality products from Bangladesh delivered to your doorstep
            </p>
            <Link href="/products" className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b py-12">
        <div className="container">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-4">
              <Truck className="h-10 w-10 text-primary-600" />
              <div>
                <h3 className="font-semibold">Fast Delivery</h3>
                <p className="text-sm text-gray-600">3-7 days delivery</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Shield className="h-10 w-10 text-primary-600" />
              <div>
                <h3 className="font-semibold">Secure Payment</h3>
                <p className="text-sm text-gray-600">100% secure transactions</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <RotateCcw className="h-10 w-10 text-primary-600" />
              <div>
                <h3 className="font-semibold">Easy Returns</h3>
                <p className="text-sm text-gray-600">7-day return policy</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <HeadphonesIcon className="h-10 w-10 text-primary-600" />
              <div>
                <h3 className="font-semibold">24/7 Support</h3>
                <p className="text-sm text-gray-600">Dedicated support team</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container">
          <h2 className="mb-8 text-3xl font-bold">Shop by Category</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {categories.map((category) => (
              <Link
                key={category}
                href={`/products?category=${encodeURIComponent(category)}`}
                className="card group hover:border-primary-500 hover:shadow-md"
              >
                <div className="text-center">
                  <div className="mb-2 flex h-20 items-center justify-center">
                    <span className="text-4xl">📦</span>
                  </div>
                  <h3 className="font-semibold group-hover:text-primary-600">{category}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Top Rated Products */}
      <section className="bg-gray-50 py-16">
        <div className="container">
          <h2 className="mb-8 text-3xl font-bold">Top Rated Products</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {topRatedProducts.map((product) => (
              <Link key={product._id} href={`/products/${product._id}`} className="card group">
                <div className="mb-4 aspect-square overflow-hidden rounded-md bg-gray-100">
                  <img
                    src={product.images[0] || 'https://via.placeholder.com/300'}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <h3 className="mb-2 font-semibold group-hover:text-primary-600">{product.name}</h3>
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-lg font-bold text-primary-600">
                    ${product.discountedPrice || product.price}
                  </span>
                  {product.discountedPrice && (
                    <span className="text-sm text-gray-500 line-through">${product.price}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex text-yellow-400">
                    {'★'.repeat(Math.round(product.rating.average))}
                    {'☆'.repeat(5 - Math.round(product.rating.average))}
                  </div>
                  <span className="text-sm text-gray-600">({product.rating.count})</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="container max-w-3xl">
          <h2 className="mb-8 text-center text-3xl font-bold">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: 'How long does delivery take?',
                a: 'Standard delivery takes 3-7 business days. Express delivery is available for select products.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards, debit cards, and cash on delivery.',
              },
              {
                q: 'Can I return a product?',
                a: 'Yes, we offer a 7-day return policy for most products. Please see our returns page for details.',
              },
            ].map((faq, idx) => (
              <details key={idx} className="card">
                <summary className="cursor-pointer font-semibold">{faq.q}</summary>
                <p className="mt-2 text-gray-600">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
