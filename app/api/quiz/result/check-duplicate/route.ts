import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { hash } = await req.json();
  if (!hash) return NextResponse.json({ exists: false });
  const user = await prisma.user.findUnique({ where: { email: session.user.email }, select: { id: true } });
  if (!user) return NextResponse.json({ exists: false });
  const existing = await prisma.quizResult.findFirst({ where: { userId: user.id, hash } });
  return NextResponse.json({ exists: !!existing });
} 