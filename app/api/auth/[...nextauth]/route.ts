import NextAuth from 'next-auth/next'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { SupabaseAdapter } from '@next-auth/supabase-adapter'
import { createClient } from '@supabase/supabase-js'
import { decode } from 'next-auth/jwt'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const handler = NextAuth({
  adapter: SupabaseAdapter({
    url: process.env.SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Email Code',
      credentials: {
        email: { label: 'Email', type: 'email' },
        token: { label: 'Token', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.token) return null

        // Decode and verify the JWT token issued after code verification
        const decoded = await decode({
          token: credentials.token,
          secret: process.env.NEXTAUTH_SECRET!,
        })

        if (!decoded || decoded.email !== credentials.email || !decoded.verified) return null

        // Get or create user in DB
        const { data: existingUser } = await supabase
          .from('users')
          .select('*')
          .eq('email', credentials.email)
          .single()

        if (existingUser) return existingUser

        // Create new user
        const { data: newUser } = await supabase
          .from('users')
          .insert({ email: credentials.email })
          .select()
          .single()

        return newUser
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) session.user.id = token.sub
      return session
    },
    async jwt({ token, user }) {
      if (user) token.sub = user.id
      return token
    },
  },
})

export { handler as GET, handler as POST }
