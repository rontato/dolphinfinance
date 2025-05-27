import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const handler = NextAuth(authOptions);

console.log('Prisma client in API route:', prisma, typeof prisma.user?.findUnique);

export { handler as GET, handler as POST }; 