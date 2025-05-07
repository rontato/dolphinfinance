import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { answers, score, maxScore } = await req.json();
    if (!answers || typeof score !== 'number' || typeof maxScore !== 'number') {
      return NextResponse.json({ 
        error: 'Invalid input data',
        details: 'Missing or invalid required fields'
      }, { status: 400 });
    }
    const session = await getServerSession(authOptions);
    let userId = null;
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({ 
        where: { email: session.user.email },
        select: { id: true }
      });
      if (!user) {
        const newUser = await prisma.user.create({
          data: {
            email: session.user.email,
            name: session.user.name || null,
            image: session.user.image || null
          }
        });
        userId = newUser.id;
      } else {
        userId = user.id;
      }
    }
    const result = await prisma.quizResult.create({
      data: {
        userId,
        answers: JSON.stringify(answers),
        score,
        maxScore,
      },
    });
    return NextResponse.json({ id: result.id });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to save results',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 