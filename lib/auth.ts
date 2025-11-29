import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import GitHub from 'next-auth/providers/github'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { db } from '@/db'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'read:user user:email',
        },
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        session.user.username = user.username
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
})