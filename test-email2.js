require('dotenv').config();
const nodemailer = require('nodemailer');

async function testEmail() {
  console.log('Testing Email Configuration with Port 465...');
  console.log('MAIL_HOST:', process.env.MAIL_HOST);
  console.log('MAIL_USER:', process.env.MAIL_USER);
  
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST || 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS ? process.env.MAIL_PASS.replace(/"/g, '') : '',
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  try {
    const info = await transporter.sendMail({
      from: '"Test Difmo CRM" <test@example.com>',
      to: 'ramjeekumaryadav733@gmail.com',
      subject: 'Difmo CRM Test Email',
      text: 'If you receive this, Port 465 worked!',
    });

    console.log('Message sent successfully! ID: %s', info.messageId);
  } catch (error) {
    console.error('Failed to send test email:', error);
  }
}

testEmail();
