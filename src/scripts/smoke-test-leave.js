require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('Using Sender:', process.env.MAIL_USER || process.env.EMAIL_USER);

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAIL_USER || process.env.EMAIL_USER,
        pass: process.env.MAIL_PASS || process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

const mailOptions = {
    from: process.env.MAIL_USER || process.env.EMAIL_USER,
    to: 'ramjeekumaryadav558@gmail.com',
    subject: 'Leave Request Status: APPROVED (Smoke Test)',
    html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-bottom: 4px solid #3b82f6;">
            <h2 style="color: #1d4ed8;">Leave Application Approved</h2>
            <p>Hello,</p>
            <p>Your leave request has been processed. Here are the details:</p>
            <div style="background: #f3f4f6; padding: 15px; border-radius: 8px;">
                <p><strong>Status:</strong> <span style="color: #059669; font-weight: bold;">APPROVED</span></p>
                <p><strong>Dates:</strong> 15th April to 20th April 2024</p>
                <p><strong>Note:</strong> Enjoy your time off!</p>
            </div>
            <p style="margin-top: 20px; font-size: 12px; color: #6b7280;">This is an automated smoke test for the CRM Notification System.</p>
        </div>
    `
};

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error('❌ Email Failed:', error);
    } else {
        console.log('✅ Email Sent Successfully:', info.response);
    }
});
