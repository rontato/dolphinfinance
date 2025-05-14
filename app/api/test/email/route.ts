/*
import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

export async function GET() {
  try {
    console.log('Starting email test...');
    
    // Verify API key is set
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      console.log('SendGrid API key not found');
      return NextResponse.json({ error: 'SendGrid API key not found' }, { status: 500 });
    }
    console.log('SendGrid API key found');

    // Initialize SendGrid
    sgMail.setApiKey(apiKey);

    // Test email configuration
    const testEmail = {
      to: 'ronnius31@gmail.com', // Your email address
      from: process.env.EMAIL_FROM || 'ronald@dolphinfinance.io',
      subject: 'DolphinFinance Test Email',
      text: 'This is a test email from your DolphinFinance application.',
      html: '<strong>This is a test email from your DolphinFinance application.</strong>'
    };

    console.log('Attempting to send test email with config:', {
      to: testEmail.to,
      from: testEmail.from,
      subject: testEmail.subject
    });

    // Try to send test email
    const response = await sgMail.send(testEmail);
    console.log('SendGrid response:', response);

    return NextResponse.json({ 
      success: true,
      message: 'SendGrid configuration is working correctly',
      response: response
    });
  } catch (error: any) {
    console.error('SendGrid test error details:', {
      message: error.message,
      code: error.code,
      response: error.response?.body,
    });
    return NextResponse.json({ 
      error: 'Failed to send test email',
      details: error instanceof Error ? error.message : 'Unknown error',
      code: error.code,
      response: error.response?.body
    }, { status: 500 });
  }
}
*/ 