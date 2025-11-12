'use client'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { ShoppingCartIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import useCartStore from '@/hooks/useCart'

const Header = () => {
  const { data: session } = useSession()
  const { items } = useCartStore()
  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              BD-Sourcing
            </Link>
            <nav className="hidden md:ml-10 md:flex md:space-x-8">
              <Link
                href="/products"
                className="text-base font-medium text-gray-500 hover:text-gray-900"
              >
                All Products
              </Link>
              <Link
                href="/terms"
                className="text-base font-medium text-gray-500 hover:text-gray-900"
              >
                Terms
              </Link>
            </nav>
          </div>
          <div className="flex items-center">
            <div className="ml-4 flow-root lg:ml-6">
              <Link href="/cart" className="group -m-2 flex items-center p-2">
                <ShoppingCartIcon
                  className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                  aria-hidden="true"
                />
                <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                  {cartItemCount}
                </span>
                <span className="sr-only">items in cart, view bag</span>
              </Link>
            </div>
            {session ? (
              <div className="ml-4 flex items-center">
                <Link href="/dashboard">
                  <UserCircleIcon className="h-8 w-8 text-gray-500 hover:text-gray-700" />
                </Link>
                <button
                  onClick={() => signOut()}
                  className="ml-4 text-sm font-medium text-gray-700 hover:text-gray-800"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="ml-4">
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-700 hover:text-gray-800"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
