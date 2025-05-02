import sgMail from '@sendgrid/mail';

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    await sgMail.send({
      to,
      from: process.env.EMAIL_FROM || 'noreply@dolphinfinance.com',
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
} 