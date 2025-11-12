'use client'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { IOrder } from '@/types'
import Link from 'next/link'

export default function OrdersPage() {
  const { data: session } = useSession()
  const [orders, setOrders] = useState<IOrder[]>([])

  useEffect(() => {
    const fetchOrders = async () => {
      if (session?.accessToken) {
        try {
          const { data } = await api.get('/orders/myorders', {
            headers: { Authorization: `Bearer ${session.accessToken}` },
          })
          setOrders(data)
        } catch (error) {
          console.error('Failed to fetch orders', error)
        }
      }
    }
    fetchOrders()
  }, [session])

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">My Orders</h1>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Order ID</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Total</th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0"><span className="sr-only">View</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">{order._id.slice(-8)}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{order.status}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${order.totalAmount.toFixed(2)}</td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <Link href={`/dashboard/orders/${order._id}`} className="text-indigo-600 hover:text-indigo-900">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
