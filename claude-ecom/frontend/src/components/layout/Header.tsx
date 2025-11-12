'use client';

import Link from 'next/link';
import { ShoppingCart, User, Menu } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
      <div className="container">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-primary-600">
            BD-Sourcing
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/" className="hover:text-primary-600">
              Home
            </Link>
            <Link href="/products" className="hover:text-primary-600">
              Products
            </Link>
            <Link href="/terms" className="hover:text-primary-600">
              Terms
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link href="/cart" className="relative hover:text-primary-600">
              <ShoppingCart className="h-6 w-6" />
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-xs text-white">
                0
              </span>
            </Link>
            <Link href="/dashboard" className="hover:text-primary-600">
              <User className="h-6 w-6" />
            </Link>
            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="flex flex-col gap-4 py-4 md:hidden">
            <Link href="/" className="hover:text-primary-600">
              Home
            </Link>
            <Link href="/products" className="hover:text-primary-600">
              Products
            </Link>
            <Link href="/terms" className="hover:text-primary-600">
              Terms
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
