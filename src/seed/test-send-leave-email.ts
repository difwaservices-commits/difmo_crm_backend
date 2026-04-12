import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { EmailService } from '../modules/leaves/email.service';

async function run() {
  const app = await NestFactory.createApplicationContext(AppModule);
  try {
    const emailService = app.get(EmailService);
    console.log('Sending test leave email via EmailService...');
    const res = await emailService.sendStatusEmail(process.env.TEST_LEAVE_EMAIL || process.env.MAIL_USER || 'test@example.com', 'Test Leave Approved', 'This is a test: your leave has been approved.');
    console.log('Email send result:', res);
  } catch (err) {
    console.error('Error sending leave email:', err);
    process.exitCode = 1;
  } finally {
    await app.close();
  }
}

run();
