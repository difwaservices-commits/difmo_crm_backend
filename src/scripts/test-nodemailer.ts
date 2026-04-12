import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { MailService } from '../modules/mail/mail.service';

async function testEmails() {
  console.log('🚀 Starting End-to-End Nodemailer Test...');
  const app = await NestFactory.createApplicationContext(AppModule);
  const mailService = app.get(MailService);

  const testRecipient = 'ramjeekumaryadav558@gmail.com';

  try {
    // 1. Test Leave Email
    console.log('Sending Leave Status test email...');
    await mailService.sendLeaveStatusEmail(testRecipient, {
      employeeName: 'Test User',
      status: 'APPROVED',
      startDate: '2024-05-01',
      endDate: '2024-05-05',
      comment: 'Hope you have a great vacation!',
    });
    console.log('✅ Leave Status Email Sent');

    // 2. Test Payroll Email
    console.log('Sending Payroll test email...');
    await mailService.sendPayrollEmail(testRecipient, {
      employeeName: 'Test User',
      month: 4,
      year: 2024,
      netSalary: 45000.50,
    });
    console.log('✅ Payroll Email Sent');

    // 3. Test Task Assignment Email
    console.log('Sending Task Assignment test email...');
    await mailService.sendTaskAssignmentEmail(testRecipient, {
      employeeName: 'Test User',
      taskTitle: 'Integrate Nodemailer E2E',
      priority: 'high',
      deadline: '2024-04-15',
    });
    console.log('✅ Task Assignment Email Sent');

  } catch (error) {
    console.error('❌ Test Failed:', error);
  } finally {
    await app.close();
    console.log('🔚 Test Completed');
  }
}

testEmails();
