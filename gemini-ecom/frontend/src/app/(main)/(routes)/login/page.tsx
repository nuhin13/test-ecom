'use client'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'

type FormData = {
  phone: string
  otp: string
}

export default function LoginPage() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'
  const { register, handleSubmit } = useForm<FormData>()

  const onOtpSubmit = async (data: FormData) => {
    await signIn('credentials', {
      phone: data.phone,
      otp: data.otp, // The backend is mocked to accept any OTP
      callbackUrl,
    })
  }

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="space-y-6">
          <button
            onClick={() => signIn('google', { callbackUrl })}
            className="flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Sign in with Google
          </button>
          
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center" aria-hidden="true"><div className="w-full border-t border-gray-200" /></div>
            <div className="relative flex justify-center text-sm font-medium leading-6"><span className="bg-white px-6 text-gray-900">Or continue with</span></div>
          </div>

          <form onSubmit={handleSubmit(onOtpSubmit)} className="space-y-4">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">Phone Number (for mocked OTP)</label>
              <input {...register('phone')} type="tel" id="phone" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"/>
            </div>
            <div>
              <label htmlFor="otp" className="block text-sm font-medium leading-6 text-gray-900">OTP (any value)</label>
              <input {...register('otp')} type="text" id="otp" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"/>
            </div>
            <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">
              Sign in with OTP
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
