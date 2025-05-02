import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check if SENDGRID_API_KEY exists (but don't expose the actual key)
    const hasApiKey = !!process.env.SENDGRID_API_KEY;
    const hasEmailFrom = !!process.env.EMAIL_FROM;

    return NextResponse.json({
      success: true,
      environment: {
        hasSendGridApiKey: hasApiKey,
        hasEmailFrom: hasEmailFrom,
        // Add other environment variables you want to check
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to check environment variables'
    }, { status: 500 });
  }
} 