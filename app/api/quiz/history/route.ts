import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const results = await prisma.quizResult.findMany({
      where: {
        user: {
          email: session.user.email,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error fetching quiz history:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 