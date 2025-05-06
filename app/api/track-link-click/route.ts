import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { quizResultId, productName, productLink } = await req.json();
    const session = await getServerSession(authOptions);

    let userId = null;
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({ 
        where: { email: session.user.email },
        select: { id: true }
      });
      userId = user?.id ?? null;
    }

    const linkClick = await prisma.linkClick.create({
      data: {
        userId,
        quizResultId: Number(quizResultId),
        productName,
        productLink,
      },
    });

    return NextResponse.json({ success: true, id: linkClick.id });
  } catch (error) {
    console.error('Error tracking link click:', error);
    return NextResponse.json(
      { error: 'Failed to track link click' },
      { status: 500 }
    );
  }
} 