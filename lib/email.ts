import sgMail from '@sendgrid/mail';

// Initialize SendGrid
const apiKey = process.env.SENDGRID_API_KEY;
if (!apiKey) {
  console.error('SendGrid API key not found in environment variables');
  throw new Error('SendGrid API key not found');
}

console.log('Initializing SendGrid...');
sgMail.setApiKey(apiKey);

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    console.log('Preparing to send email to:', to);
    console.log('Email subject:', subject);
    console.log('Email HTML length:', html.length);

    const msg = {
      to,
      from: process.env.EMAIL_FROM || 'noreply@dolphinfinance.com',
      subject,
      html,
    };

    console.log('Sending email with configuration:', {
      to: msg.to,
      from: msg.from,
      subject: msg.subject,
      htmlLength: msg.html.length
    });

    const response = await sgMail.send(msg);
    console.log('SendGrid response:', response);
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

    // Throw a more informative error
    throw new Error(`Failed to send email: ${error.message}`);
  }
} 