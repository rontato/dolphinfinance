import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from './prisma';
import { compare } from 'bcryptjs';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
  }
}

console.log('Prisma client before adapter:', prisma, typeof prisma.user?.findUnique);

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user || !user.password) return null;
        const isValid = await compare(credentials.password, user.password);
        if (!isValid) return null;
        // NextAuth expects id as string
        return { ...user, id: String(user.id) };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: 'jwt' as const },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      // Only run for Google sign-in
      if (account?.provider === 'google') {
        // Find user by email
        if (!user.email) {
          // If email is missing, do not allow sign in
          return false;
        }
        const existingUser = await prisma.user.findUnique({ where: { email: user.email } });
        if (existingUser) {
          // Check if Google account is already linked
          const googleAccount = await prisma.account.findFirst({
            where: {
              userId: existingUser.id,
              provider: 'google',
              providerAccountId: account.providerAccountId,
            },
          });
          if (!googleAccount) {
            // Link Google account to existing user
            await prisma.account.create({
              data: {
                userId: existingUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                id_token: account.id_token,
                refresh_token: account.refresh_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                session_state: account.session_state,
              },
            });
          }
          // Override user.id to ensure session is for the existing user
          user.id = existingUser.id;
        }
      }
      // Always allow sign in
      return true;
    },
    async redirect({ url, baseUrl }) {
      // Always redirect to home after sign in
      return baseUrl;
    },
  },
}; 