import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '../../../lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { answers, score, maxScore, recommendations } = await req.json();
    console.log('Saving quiz results with score:', score);
    
    // Try to get session
    const session = await getServerSession(authOptions);
    let userId = null;
    
    if (session?.user?.email) {
      // Authenticated user flow
      console.log('User is authenticated:', session.user.email);
      const user = await prisma.user.findUnique({ 
        where: { email: session.user.email },
        select: { id: true }
      });
      
      if (!user) {
        console.log('Creating new user for:', session.user.email);
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
      
      console.log('Saving quiz result for user:', userId);
    }
    
    // Save quiz result
    const result = await prisma.quizResult.create({
      data: {
        userId,
        answers,
        score,
        maxScore,
        recommendations: JSON.stringify(recommendations), // Ensure recommendations are stored as a string
      },
    });
    
    console.log('Quiz result saved successfully:', result.id);
    return NextResponse.json({ id: result.id });
    
  } catch (error) {
    console.error('Error saving quiz results:', error);
    return NextResponse.json({ 
      error: 'Failed to save results',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 