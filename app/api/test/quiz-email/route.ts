/*
import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

export async function GET() {
  try {
    // Verify API key is set
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'SendGrid API key not found' }, { status: 500 });
    }

    // Initialize SendGrid
    sgMail.setApiKey(apiKey);

    // Sample quiz results
    const sampleResults = {
      score: 75,
      maxScore: 100,
      recommendations: [
        {
          section: "Income & Budgeting",
          score: 12,
          maxScore: 15,
          details: [
            "✓ Has income (+5 points)",
            "✓ Good spending ratio - 51-70% of income (+7 points)"
          ]
        },
        {
          section: "Banking & Accounts",
          score: 10,
          maxScore: 15,
          details: [
            "✓ Has checking account (+5 points)",
            "✓ Has savings account (+5 points)"
          ]
        },
        {
          section: "Debt Management",
          score: 15,
          maxScore: 20,
          details: [
            "✓ No debt (DTI: 0%) (+10 points)",
            "✓ Only manageable debt (+5 points)"
          ]
        },
        {
          section: "Credit Score",
          score: 8,
          maxScore: 10,
          details: [
            "✓ Good credit score: 670-739 (+6 points)",
            "✓ Has one credit card (+2 points)"
          ]
        },
        {
          section: "Investing",
          score: 15,
          maxScore: 20,
          details: [
            "✓ Has brokerage account (+5 points)",
            "✓ Diversified investments (+5 points)",
            "✓ Has investments (+5 points)"
          ]
        },
        {
          section: "Retirement",
          score: 15,
          maxScore: 20,
          details: [
            "✓ Has Roth IRA (+5 points)",
            "✓ Has 401(k) (+5 points)",
            "✓ Good retirement savings (+5 points)"
          ]
        }
      ]
    };

    // Create email content
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #0058C0;">Your Financial Health Assessment Results</h1>
        <p>Thank you for completing our financial health assessment!</p>
        
        <!-- 1. Financial Health Score -->
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #0058C0;">Your Financial Health Score: ${sampleResults.score}/100</h2>
          <div style="background-color: #e9ecef; height: 20px; border-radius: 10px; margin: 10px 0;">
            <div style="background-color: #0058C0; width: ${(sampleResults.score/sampleResults.maxScore)*100}%; height: 100%; border-radius: 10px;"></div>
          </div>
        </div>

        <!-- 2. Product Recommendations -->
        <div style="margin-bottom: 20px;">
          <h3 style="color: #0058C0;">Recommended Products for You:</h3>
          <div style="display: grid; grid-template-columns: 1fr; gap: 15px;">
            <!-- High-Yield Savings Card -->
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; border: 1px solid #e9ecef;">
              <h4 style="color: #0058C0; margin: 0 0 10px 0;">High-Yield Savings Account</h4>
              <p style="margin: 0 0 15px 0;">Earn up to 4.5% APY on your savings with our premium savings account.</p>
              <a href="https://dolphinfinance.io/apply/savings" style="display: inline-block; background-color: #0058C0; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Apply Now</a>
            </div>

            <!-- Investment Portfolio Card -->
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; border: 1px solid #e9ecef;">
              <h4 style="color: #0058C0; margin: 0 0 10px 0;">Investment Portfolio</h4>
              <p style="margin: 0 0 15px 0;">Start building your wealth with as little as $100. Professional portfolio management.</p>
              <a href="https://dolphinfinance.io/apply/invest" style="display: inline-block; background-color: #0058C0; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Start Investing</a>
            </div>

            <!-- Retirement Planning Card -->
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; border: 1px solid #e9ecef;">
              <h4 style="color: #0058C0; margin: 0 0 10px 0;">Retirement Planning Tools</h4>
              <p style="margin: 0 0 15px 0;">Optimize your 401(k) and IRA contributions with our smart retirement planning tools.</p>
              <a href="https://dolphinfinance.io/apply/retirement" style="display: inline-block; background-color: #0058C0; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Plan Retirement</a>
            </div>

            <!-- Credit Score Card -->
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; border: 1px solid #e9ecef;">
              <h4 style="color: #0058C0; margin: 0 0 10px 0;">Credit Score Monitoring</h4>
              <p style="margin: 0 0 15px 0;">Track your credit health in real-time with comprehensive monitoring tools.</p>
              <a href="https://dolphinfinance.io/apply/credit" style="display: inline-block; background-color: #0058C0; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Start Monitoring</a>
            </div>
          </div>
        </div>

        <!-- 3. Score Breakdown -->
        <div style="margin-bottom: 20px;">
          <h3 style="color: #0058C0;">Your Score Breakdown:</h3>
          ${sampleResults.recommendations.map(rec => `
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
      </div>
    `;

    // Send email
    await sgMail.send({
      to: 'ronnius31@gmail.com',
      from: 'ronald@dolphinfinance.io', // Using your new domain
      subject: 'Your Financial Health Assessment Results',
      html: emailContent
    });

    return NextResponse.json({ 
      success: true,
      message: 'Sample quiz results email sent successfully'
    });
  } catch (error) {
    console.error('Error sending sample quiz results email:', error);
    return NextResponse.json({ 
      error: 'Failed to send sample quiz results email',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
*/ 