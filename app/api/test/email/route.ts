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

    // Test email configuration
    const testEmail = {
      to: 'ronnius31@gmail.com',
      from: 'ronald@dolphinfinance.com', // This needs to be verified in SendGrid
      subject: 'SendGrid Test Email',
      text: 'This is a test email from your Dolphin Finance application.',
      html: '<strong>This is a test email from your Dolphin Finance application.</strong>'
    };

    // Try to send test email
    await sgMail.send(testEmail);

    return NextResponse.json({ 
      success: true,
      message: 'SendGrid configuration is working correctly'
    });
  } catch (error) {
    console.error('SendGrid test error:', error);
    return NextResponse.json({ 
      error: 'Failed to send test email',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 