'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { userAPI, ordersAPI } from '@/lib/api';
import { User, Order } from '@/types';
import { formatPrice, formatDate } from '@/lib/utils';
import { Package, User as UserIcon, Settings, LogOut } from 'lucide-react';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [userRes, ordersRes] = await Promise.all([
        userAPI.getProfile(),
        ordersAPI.getUserOrders({ page: 1, limit: 5 }),
      ]);

      if (userRes.data.success && userRes.data.data) {
        setUser(userRes.data.data);
      }

      if (ordersRes.data.success && ordersRes.data.data) {
        setOrders(ordersRes.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      // Redirect to login if not authenticated
      window.location.href = '/login';
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container text-center">
          <h1 className="mb-4 text-3xl font-bold">Please Login</h1>
          <p className="mb-8 text-gray-600">You need to be logged in to view this page</p>
          <Link href="/login" className="btn-primary">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container">
        <h1 className="mb-8 text-3xl font-bold">My Dashboard</h1>

        <div className="grid gap-8 lg:grid-cols-4">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card">
              <div className="mb-6 text-center">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="mx-auto h-20 w-20 rounded-full"
                  />
                ) : (
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary-100">
                    <UserIcon className="h-10 w-10 text-primary-600" />
                  </div>
                )}
                <h2 className="mt-4 text-xl font-semibold">{user.name}</h2>
                <p className="text-sm text-gray-600">{user.email || user.phone}</p>
              </div>

              <nav className="space-y-2">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 rounded-md bg-primary-50 px-4 py-2 text-primary-600"
                >
                  <Package className="h-5 w-5" />
                  Orders
                </Link>
                <Link
                  href="/dashboard/profile"
                  className="flex items-center gap-3 rounded-md px-4 py-2 hover:bg-gray-100"
                >
                  <Settings className="h-5 w-5" />
                  Profile Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-md px-4 py-2 text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Stats */}
            <div className="mb-8 grid gap-4 sm:grid-cols-3">
              <div className="card">
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="mt-2 text-3xl font-bold">{orders.length}</p>
              </div>
              <div className="card">
                <p className="text-sm text-gray-600">Pending</p>
                <p className="mt-2 text-3xl font-bold">
                  {orders.filter((o) => o.status === 'pending').length}
                </p>
              </div>
              <div className="card">
                <p className="text-sm text-gray-600">Delivered</p>
                <p className="mt-2 text-3xl font-bold">
                  {orders.filter((o) => o.status === 'delivered').length}
                </p>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="card">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Recent Orders</h2>
                <Link href="/dashboard/orders" className="text-primary-600 hover:underline">
                  View All
                </Link>
              </div>

              {orders.length === 0 ? (
                <div className="py-8 text-center text-gray-500">
                  <p>No orders yet</p>
                  <Link href="/products" className="btn-primary mt-4">
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <Link
                      key={order._id}
                      href={`/dashboard/orders/${order._id}`}
                      className="block rounded-lg border p-4 hover:border-primary-500 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold">Order #{order.orderNumber}</p>
                          <p className="mt-1 text-sm text-gray-600">
                            {formatDate(order.createdAt)}
                          </p>
                          <p className="mt-2 text-sm">
                            {order.items.length} item(s) • {formatPrice(order.finalAmount)}
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status.toUpperCase()}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
