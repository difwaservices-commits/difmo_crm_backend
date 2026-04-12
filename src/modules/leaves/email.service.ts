import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendStatusEmail(to: string, status: string, comment?: string) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: `Leave Request Update: ${status}`,
      html: `
        <h3>Your Leave Request Status has been updated</h3>
        <p><strong>New Status:</strong> ${status}</p>
        ${comment ? `<p><strong>Admin Comment:</strong> ${comment}</p>` : ''}
        <br>
        <p>This is an automated notification.</p>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('📧 Email sent successfully to:', to);
    } catch (error) {
      console.error('❌ Email failed to send:', error);
    }
  }
}