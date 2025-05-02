import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { sendEmail } from '../../../lib/email';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function POST(req: NextRequest) {
  try {
    console.log('Starting email subscription process...');
    const { email, quizResultId } = await req.json();
    console.log('Received request data:', { email, quizResultId });

    // Validate email
    if (!email || !email.includes('@')) {
      console.log('Invalid email format:', email);
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // Get session to check if user is authenticated
    console.log('Checking user session...');
    const session = await getServerSession(authOptions);
    let userId: number | null = null;

    if (session?.user?.email) {
      console.log('User is authenticated:', session.user.email);
      const user = await prisma.user.findUnique({ where: { email: session.user.email } });
      userId = user?.id || null;
    }

    // Get quiz results first to ensure they exist
    console.log('Fetching quiz results...');
    const quizResult = await prisma.quizResult.findUnique({
      where: { id: quizResultId },
    });

    if (!quizResult) {
      console.log('Quiz results not found for ID:', quizResultId);
      return NextResponse.json({ error: 'Quiz results not found' }, { status: 404 });
    }
    console.log('Quiz results found:', { score: quizResult.score, maxScore: quizResult.maxScore });

    // Create or update email subscription
    console.log('Creating email subscription...');
    const subscription = await prisma.emailSubscription.create({
      data: {
        email,
        quizResultId,
        userId,
        status: 'active'
      },
    });
    console.log('Email subscription created:', subscription);

    // Send email with results
    try {
      console.log('Attempting to send email...');
      
      // Parse recommendations safely
      let recommendationsHtml = '';
      try {
        const recommendations = typeof quizResult.recommendations === 'string' 
          ? JSON.parse(quizResult.recommendations)
          : quizResult.recommendations;
        
        recommendationsHtml = Array.isArray(recommendations) 
          ? recommendations.map((rec: any) => `
              <li style="margin-bottom: 15px;">
                <strong style="color: #0058C0;">${rec.section}:</strong>
                <ul style="margin-top: 5px;">
                  ${Array.isArray(rec.details) 
                    ? rec.details.map((detail: string) => `<li style="margin-bottom: 5px;">${detail}</li>`).join('')
                    : ''}
                </ul>
              </li>
            `).join('')
          : '';
      } catch (parseError) {
        console.error('Error parsing recommendations:', parseError);
        recommendationsHtml = '<li>No recommendations available</li>';
      }

      await sendEmail({
        to: email,
        subject: 'Your Financial Health Assessment Results',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #0058C0;">Your Financial Health Assessment Results</h1>
            <p>Thank you for completing our financial health assessment!</p>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="color: #0058C0;">Your Score: ${quizResult.score}/${quizResult.maxScore}</h2>
            </div>
            <h3 style="color: #0058C0;">Personalized Recommendations:</h3>
            <ul>
              ${recommendationsHtml}
            </ul>
            <p style="margin-top: 20px;">Stay tuned for more personalized financial insights and tips!</p>
            <p style="margin-top: 20px; font-size: 12px; color: #6c757d;">
              This email was sent from Dolphin Finance. If you have any questions, please contact us at support@dolphinfinance.com
            </p>
          </div>
        `,
      });
      console.log('Email sent successfully');
    } catch (emailError: any) {
      console.error('Detailed email sending error:', {
        message: emailError.message,
        response: emailError.response?.body,
        code: emailError.code,
        stack: emailError.stack,
        headers: emailError.response?.headers,
        statusCode: emailError.response?.statusCode
      });
      // Update subscription status to failed
      await prisma.emailSubscription.update({
        where: { id: subscription.id },
        data: { status: 'failed' }
      });
      throw emailError;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error in subscription process:', {
      message: error.message,
      response: error.response?.body,
      code: error.code,
      stack: error.stack,
      headers: error.response?.headers,
      statusCode: error.response?.statusCode
    });
    
    // Extract more detailed error information
    let errorMessage = 'Failed to process subscription';
    let errorDetails = 'Unknown error';
    
    if (error.response?.body?.errors) {
      errorMessage = error.response.body.errors.map((err: any) => err.message).join(', ');
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    if (error.response?.body) {
      errorDetails = JSON.stringify(error.response.body);
    } else if (error.message) {
      errorDetails = error.message;
    }
    
    return NextResponse.json({ 
      error: errorMessage,
      details: errorDetails,
      code: error.code,
      statusCode: error.response?.statusCode
    }, { status: 500 });
  }
} 