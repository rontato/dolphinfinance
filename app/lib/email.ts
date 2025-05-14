import sgMail from '@sendgrid/mail';

interface EmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailParams) {
  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) {
    console.warn('SendGrid API key not found - email functionality disabled');
    return false; // Gracefully handle missing API key
  }

  try {
    sgMail.setApiKey(apiKey);
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
    console.error('SendGrid error:', error.message);
    return false; // Return false instead of throwing error
  }
} 