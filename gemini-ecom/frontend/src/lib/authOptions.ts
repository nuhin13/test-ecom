import type { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import api from './api'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: 'Phone OTP',
      credentials: {
        phone: { label: 'Phone Number', type: 'text', placeholder: '01...' },
        otp: { label: 'OTP', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials) return null
        try {
          // This is a MOCKED login. The backend will accept any OTP.
          const { data } = await api.post('/auth/login-otp', {
            phone: credentials.phone,
            otp: credentials.otp,
          })
          if (data) {
            return { ...data.user, apiToken: data.token }
          }
          return null
        } catch (e: any) {
          console.error(e.response?.data?.message || e.message)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Persist the API token and user info to the JWT
      if (account && user) {
        // This is the first sign-in
        if (account.provider === 'google') {
            // Here we could create a user in our backend if they don't exist
            // For simplicity, we assume the backend handles this.
        }
        return {
          ...token,
          apiToken: (user as any).apiToken,
          id: (user as any)._id,
        }
      }
      return token
    },
    async session({ session, token }) {
      // Persist the API token and user info to the session
      session.user.id = token.id as string
      session.accessToken = token.apiToken as string
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
}
