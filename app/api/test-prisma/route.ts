import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const user = await prisma.user.findFirst();
    return NextResponse.json({ user });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
} 