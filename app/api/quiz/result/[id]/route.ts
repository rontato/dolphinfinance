import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  console.log('GET /api/quiz/result/[id] hit with params:', context.params);
  const session = await getServerSession(authOptions);
  console.log('Session:', session);
  if (!session?.user?.email) {
    console.log('Unauthorized: No session or email');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const id = context.params.id;
  try {
    const user = await prisma.user.findUnique({ where: { email: session.user.email }, select: { id: true } });
    console.log('User found:', user);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    const result = await prisma.quizResult.findUnique({ where: { id: Number(id), userId: user.id } });
    console.log('Quiz result found:', result);
    if (!result) return NextResponse.json({ error: 'Quiz result not found' }, { status: 404 });
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching quiz result:', error);
    return NextResponse.json({ error: 'Failed to fetch quiz result' }, { status: 500 });
  }
} 