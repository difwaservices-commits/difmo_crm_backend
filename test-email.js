require('dotenv').config();
const nodemailer = require('nodemailer');

async function testEmail() {
  console.log('Testing Email Configuration...');
  console.log('MAIL_HOST:', process.env.MAIL_HOST);
  console.log('MAIL_USER:', process.env.MAIL_USER);
  console.log('MAIL_PASS:', process.env.MAIL_PASS ? '***' : 'MISSING');
  
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST || 'smtp.gmail.com',
    port: process.env.MAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS, // ensure this has no quotes around it in the script
    },
  });

  try {
    const info = await transporter.sendMail({
      from: '"Test Difmo CRM" <test@example.com>',
      to: 'ramjeekumaryadav733@gmail.com',
      subject: 'Difmo CRM Test Email',
      text: 'If you receive this, Nodemailer is perfectly configured.',
      html: '<b>If you receive this, Nodemailer is perfectly configured.</b>',
    });

    console.log('Message sent successfully! ID: %s', info.messageId);
  } catch (error) {
    console.error('Failed to send test email. Error exactly below:');
    console.error(error);
  }
}

testEmail();
