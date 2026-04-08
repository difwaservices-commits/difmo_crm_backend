require('dotenv').config();
const nodemailer = require('nodemailer');

async function sendTest() {
  const host = process.env.MAIL_HOST || 'smtp.gmail.com';
  const port = Number(process.env.MAIL_PORT || 465);
  const user = process.env.MAIL_USER || 'test@example.com';
  const pass = process.env.MAIL_PASS || 'password';
  const to = process.env.MAIL_TEST_TO || user;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    tls: { rejectUnauthorized: false }
  });

  try {
    await transporter.verify();
    console.log('SMTP connection ok. Sending test email to', to);
    const info = await transporter.sendMail({
      from: user,
      to,
      subject: 'Test Email from Difmo CRM',
      text: 'This is a test email to verify SMTP configuration.'
    });
    console.log('Email sent:', info.response || info.messageId);
  } catch (err) {
    console.error('Failed to send test email:', err);
  }
}

sendTest();
