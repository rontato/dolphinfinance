import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
  const { email, password } = await req.json();
    console.log('Received signup request:', { email });
  if (!email || !password) {
      console.error('Missing email or password');
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
  }
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
      console.error('User already exists:', email);
    return NextResponse.json({ error: 'User already exists.' }, { status: 400 });
  }
  const hashed = await hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hashed },
  });
    console.log('User created successfully:', user.id);
  return NextResponse.json({ id: user.id, email: user.email });
  } catch (err) {
    console.error('Error in signup API:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 