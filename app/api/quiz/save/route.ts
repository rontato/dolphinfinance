import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    console.log('Starting quiz save process...');
    const { answers, score, maxScore, recommendations } = await req.json();
    console.log('Received data:', { score, maxScore, hasAnswers: !!answers, hasRecommendations: !!recommendations });
    
    // Validate input
    if (!answers || typeof score !== 'number' || typeof maxScore !== 'number' || !recommendations) {
      console.log('Validation failed:', { 
        hasAnswers: !!answers, 
        scoreType: typeof score, 
        maxScoreType: typeof maxScore, 
        hasRecommendations: !!recommendations 
      });
      return NextResponse.json({ 
        error: 'Invalid input data',
        details: 'Missing or invalid required fields'
      }, { status: 400 });
    }

    console.log('Saving quiz results with score:', score);
    
    // Try to get session
    console.log('Checking for user session...');
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
    } else {
      console.log('No user session found, proceeding with anonymous submission');
    }
    
    // Save quiz result
    try {
      console.log('Attempting to save quiz result to database...');
      console.log('Quiz data being saved:', {
        userId,
        score,
        maxScore,
        answersLength: JSON.stringify(answers).length,
        recommendationsLength: JSON.stringify(recommendations).length
      });

      const result = await prisma.quizResult.create({
        data: {
          userId,
          answers: JSON.stringify(answers),
          score,
          maxScore,
          recommendations: JSON.stringify(recommendations),
        },
      });
      
      console.log('Quiz result saved successfully:', result.id);
      return NextResponse.json({ id: result.id });
    } catch (dbError) {
      console.error('Database error details:', {
        error: dbError,
        message: dbError instanceof Error ? dbError.message : 'Unknown database error',
        stack: dbError instanceof Error ? dbError.stack : undefined
      });
      return NextResponse.json({ 
        error: 'Database error',
        details: dbError instanceof Error ? dbError.message : 'Failed to save to database'
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('Error saving quiz results:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json({ 
      error: 'Failed to save results',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 