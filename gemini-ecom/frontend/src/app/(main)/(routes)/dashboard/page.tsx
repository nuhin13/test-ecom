'use client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (status === 'unauthenticated') {
    router.push('/login')
    return null
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">Welcome, {session?.user?.name}</h1>
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-lg bg-gray-100 p-6">
          <h2 className="text-lg font-semibold">My Profile</h2>
          <p>Email: {session?.user?.email}</p>
          {/* Profile edit form could go here */}
        </div>
        <div className="rounded-lg bg-gray-100 p-6">
          <h2 className="text-lg font-semibold">My Orders</h2>
          <p>View your order history and status.</p>
          <Link href="/dashboard/orders" className="mt-4 inline-block text-indigo-600">View Orders</Link>
        </div>
      </div>
    </div>
  )
}
