import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Helper function to get product recommendations based on scores
function getProductRecommendations(scores: any) {
  const recommendations = [];
  
  // High-Yield Savings Account
  if (scores.some((s: any) => s.section === "Income & Budgeting" && s.score / s.maxScore >= 0.7)) {
    recommendations.push({
      category: "High-Yield Savings Account",
      explanation: "With your strong income and budgeting habits, you're well-positioned to maximize your savings. A high-yield savings account can help your money work harder for you.",
      products: [
        {
          name: "Premium Savings Account",
          description: "Earn up to 4.5% APY with no minimum balance requirements.",
          link: "https://dolphinfinance.io/apply/savings-premium"
        },
        {
          name: "Money Market Account",
          description: "Earn competitive rates while maintaining liquidity.",
          link: "https://dolphinfinance.io/apply/savings-money-market"
        }
      ]
    });
  }

  // Investment Portfolio
  if (scores.some((s: any) => s.section === "Investing" && s.score / s.maxScore < 0.5)) {
    recommendations.push({
      category: "Investment Portfolio",
      explanation: "Your quiz results indicate room for growth in your investment strategy. Our professionally managed portfolios can help you build long-term wealth with minimal effort.",
      products: [
        {
          name: "Managed Investment Portfolio",
          description: "Start investing with as little as $100. Professional management and automatic rebalancing.",
          link: "https://dolphinfinance.io/apply/invest-managed"
        },
        {
          name: "Index Fund Portfolio",
          description: "Low-cost, diversified investing in major market indices.",
          link: "https://dolphinfinance.io/apply/invest-index"
        }
      ]
    });
  }

  // Retirement Planning
  if (scores.some((s: any) => s.section === "Retirement" && s.score / s.maxScore < 0.6)) {
    recommendations.push({
      category: "Retirement Planning",
      explanation: "Your retirement readiness score suggests an opportunity to strengthen your long-term financial security. Our retirement tools can help you get on track.",
      products: [
        {
          name: "IRA Optimizer",
          description: "Maximize your retirement savings with tax-advantaged accounts.",
          link: "https://dolphinfinance.io/apply/retirement-ira"
        },
        {
          name: "401(k) Rollover Service",
          description: "Consolidate and optimize your retirement accounts.",
          link: "https://dolphinfinance.io/apply/retirement-rollover"
        }
      ]
    });
  }

  // Credit Building
  if (scores.some((s: any) => s.section === "Credit Score" && s.score / s.maxScore < 0.7)) {
    recommendations.push({
      category: "Credit Building Tools",
      explanation: "Your credit score has room for improvement. Our credit building tools can help you track and improve your creditworthiness.",
      products: [
        {
          name: "Credit Score Monitor",
          description: "Real-time credit score tracking and improvement recommendations.",
          link: "https://dolphinfinance.io/apply/credit-monitor"
        },
        {
          name: "Credit Builder Account",
          description: "Build credit history while saving money.",
          link: "https://dolphinfinance.io/apply/credit-builder"
        }
      ]
    });
  }

  return recommendations;
}

/*
export async function POST(req: NextRequest) {
  try {
    console.log('Starting email subscription process...');
    const body = await req.json();
    console.log('Raw request body:', body);
    
    const { email, quizResultId } = body;
    console.log('Parsed request data:', { email, quizResultId, type: typeof quizResultId });

    // Validate input
    if (!email || !quizResultId) {
      console.log('Validation failed:', { hasEmail: !!email, hasQuizId: !!quizResultId });
      return NextResponse.json({ 
        error: 'Missing required fields',
        details: 'Email and quiz result ID are required'
      }, { status: 400 });
    }

    // Validate email format
    if (!email.includes('@') || !email.includes('.')) {
      console.log('Invalid email format:', email);
      return NextResponse.json({ 
        error: 'Invalid email format',
        details: 'Please provide a valid email address'
      }, { status: 400 });
    }

    // Get session to check if user is authenticated
    console.log('Checking user session...');
    const session = await getServerSession(authOptions);
    let userId: number | null = null;

    if (session?.user?.email) {
      console.log('User is authenticated:', session.user.email);
      const user = await prisma.user.findUnique({ where: { email: session.user.email } });
      userId = user?.id || null;
      console.log('Found user ID:', userId);
    } else {
      console.log('No user session found, proceeding with anonymous submission');
    }

    // Get quiz results first to ensure they exist
    console.log('Fetching quiz results for ID:', quizResultId);
    const quizResult = await prisma.quizResult.findUnique({
      where: { id: Number(quizResultId) },
    });

    if (!quizResult) {
      console.log('Quiz results not found for ID:', quizResultId);
      return NextResponse.json({ 
        error: 'Quiz results not found',
        details: 'The specified quiz result could not be found'
      }, { status: 404 });
    }

    // Parse recommendations
    const recommendations = typeof quizResult.recommendations === 'string' 
      ? JSON.parse(quizResult.recommendations)
      : quizResult.recommendations;

    // Get product recommendations
    const productRecommendations = getProductRecommendations(recommendations);

    // Calculate score percentage
    const scorePercentage = (quizResult.score / quizResult.maxScore) * 100;
    
    // Generate the email HTML
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #0058C0; margin-bottom: 10px;">Your Financial Deep Dive Results</h1>
          <p style="color: #666; font-size: 16px;">Thank you for completing our comprehensive financial health assessment. Here's your personalized analysis and recommendations.</p>
        </div>

        <!-- Score Section -->
        <div style="background-color: #f8f9fa; padding: 25px; border-radius: 10px; margin-bottom: 30px;">
          <h2 style="color: #0058C0; margin-top: 0; margin-bottom: 15px;">Your Financial Health Score</h2>
          <div style="text-align: center;">
            <p style="font-size: 24px; font-weight: bold; margin-bottom: 15px;">${quizResult.score}/${quizResult.maxScore}</p>
            <div style="background-color: #e9ecef; height: 20px; border-radius: 10px; overflow: hidden;">
              <div style="background-color: #0058C0; width: ${scorePercentage}%; height: 100%; transition: width 1s ease-in-out;"></div>
            </div>
          </div>
        </div>

        <!-- Product Recommendations -->
        <div style="margin-bottom: 30px;">
          <h2 style="color: #0058C0; margin-bottom: 20px;">Personalized Product Recommendations</h2>
          <div style="display: grid; grid-template-columns: 1fr; gap: 15px;">
            ${productRecommendations.map(rec => `
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; border: 1px solid #e9ecef;">
                <h4 style="color: #0058C0; margin: 0 0 10px 0;">${rec.title}</h4>
                <p style="margin: 0 0 15px 0;">${rec.description}</p>
                <a href="${rec.link}" style="display: inline-block; background-color: #0058C0; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">${rec.cta}</a>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Score Breakdown -->
        <div style="margin-bottom: 30px;">
          <h2 style="color: #0058C0; margin-bottom: 20px;">Your Score Breakdown</h2>
          ${recommendations.map(rec => `
            <div style="margin-bottom: 15px; padding: 15px; background-color: #f8f9fa; border-radius: 8px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <h4 style="margin: 0; color: #0058C0;">${rec.section}</h4>
                <span style="font-weight: 600;">${rec.score}/${rec.maxScore}</span>
              </div>
              <div style="background-color: #e9ecef; height: 8px; border-radius: 4px; margin: 10px 0;">
                <div style="background-color: #0058C0; width: ${(rec.score/rec.maxScore)*100}%; height: 100%; border-radius: 4px;"></div>
              </div>
              <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                ${rec.details.map(detail => `<li style="margin-bottom: 5px;">${detail}</li>`).join('')}
              </ul>
            </div>
          `).join('')}
        </div>

        <div style="margin-top: 30px; padding: 20px; background-color: #e6f0fa; border-radius: 8px;">
          <h3 style="color: #0058C0; margin-top: 0;">Next Steps</h3>
          <p>Based on your results, here are some recommended next steps:</p>
          <ul>
            <li>Review your spending habits and create a monthly budget</li>
            <li>Consider opening a high-yield savings account</li>
            <li>Start contributing to your retirement accounts</li>
            <li>Monitor your credit score regularly</li>
          </ul>
        </div>

        <p style="margin-top: 30px; font-size: 14px; color: #6c757d;">
          This email was sent from Dolphin Finance. If you have any questions, please contact us at support@dolphinfinance.io
        </p>
      </body>
      </html>
    `;

    // Create or update email subscription and send email
    try {
      console.log('Creating email subscription...');
      const subscription = await prisma.emailSubscription.create({
        data: {
          email,
          quizResultId: Number(quizResultId),
          userId: null, // or userId if you have it
          status: 'active'
        },
      });

      // Send email
      await sendEmail({
        to: email,
        subject: 'Your Personalized Financial Health Assessment',
        html: emailHtml,
      });

      return NextResponse.json({ success: true });
    } catch (error: any) {
      console.error('Error:', error);
      return NextResponse.json({ 
        error: 'Failed to process request',
        details: error.message
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Error in subscription process:', error);
    return NextResponse.json({ 
      error: 'Failed to process subscription',
      details: error.message
    }, { status: 500 });
  }
}
*/ 