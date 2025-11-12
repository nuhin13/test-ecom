'use client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import useCartStore from '@/hooks/useCart'
import api from '@/lib/api'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { items, clearCart } = useCartStore()
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/checkout')
    }
  }, [status, router])

  const handlePlaceOrder = async () => {
    const orderData = {
        items: items.map(item => ({ productId: item.product._id, quantity: item.quantity })),
        shippingAddress: { // Dummy address
            street: '123 Main St',
            city: 'Dhaka',
            zip: '1212',
            country: 'Bangladesh'
        }
    }
    try {
        const { data } = await api.post('/orders', orderData, {
            headers: { Authorization: `Bearer ${session?.accessToken}` }
        });
        toast.success('Order placed successfully!');
        clearCart();
        router.push(`/dashboard/orders/${data._id}`);
    } catch (error) {
        toast.error('Failed to place order.');
        console.error(error);
    }
  }

  if (status === 'loading' || !session) {
    return <div>Loading...</div>
  }

  return (
    <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Checkout</h1>
      <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
        <div className="lg:col-span-7">
          {/* Shipping and Payment Forms would go here */}
          <h2 className="text-lg font-medium text-gray-900">Shipping Information</h2>
          <p className="mt-4">Hello, {session.user?.name}. Your order will be shipped to a default address.</p>
          <p className="mt-4 font-bold">This is a MOCK checkout. No payment will be processed.</p>
        </div>
        <div className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
          <h2 className="text-lg font-medium text-gray-900">Order summary</h2>
          {/* ... order summary ... */}
          <div className="mt-6">
            <button onClick={handlePlaceOrder} className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700">
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
