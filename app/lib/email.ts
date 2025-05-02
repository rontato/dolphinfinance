import sgMail from '@sendgrid/mail';

interface EmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailParams) {
  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) {
    console.error('SendGrid API key not found in environment variables');
    throw new Error('SendGrid API key not found');
  }

  console.log('Initializing SendGrid with API key...');
  sgMail.setApiKey(apiKey);

  try {
    console.log(`Attempting to send email to ${to}...`);
    const msg = {
      to,
      from: 'ronald@dolphinfinance.io', // Using the verified sender email
      subject,
      html,
    };
    
    console.log('Email payload:', JSON.stringify(msg, null, 2));
    const response = await sgMail.send(msg);
    console.log('SendGrid API Response:', response);
    return true;
  } catch (error: any) {
    console.error('Detailed SendGrid error:', {
      message: error.message,
      response: error.response?.body,
      code: error.code,
      stack: error.stack,
      headers: error.response?.headers,
      statusCode: error.response?.statusCode
    });
    
    // Extract more detailed error information
    let errorMessage = 'Failed to send email';
    if (error.response?.body?.errors) {
      errorMessage = error.response.body.errors.map((err: any) => err.message).join(', ');
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    throw new Error(`SendGrid Error: ${errorMessage}`);
  }
} 