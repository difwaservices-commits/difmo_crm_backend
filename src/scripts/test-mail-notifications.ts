import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { MailService } from '../modules/mail/mail.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const mailService = app.get(MailService);

  const testEmail = 'ramjeekumaryadav558@gmail.com';

  console.log(`🚀 Sending test notifications to: ${testEmail}`);

  try {
    // 1. Test Leave Email
    console.log('--- Sending Leave Status Email ---');
    await mailService.sendLeaveStatusEmail(testEmail, {
      employeeName: 'Ramjee Kumar Yadav',
      status: 'approved',
      startDate: '2026-04-15',
      endDate: '2026-04-17',
      comment: 'Your leave request has been approved by the manager. Enjoy your time off!',
    });
    console.log('✅ Leave email sent successfully.');

    // 2. Test Payroll Email
    console.log('--- Sending Payroll Notification Email ---');
    await mailService.sendPayrollEmail(testEmail, {
      employeeName: 'Ramjee Kumar Yadav',
      month: 4,
      year: 2026,
      netSalary: 75000.50,
    });
    console.log('✅ Payroll email sent successfully.');

  } catch (error) {
    console.error('❌ Error sending test emails:', error.message);
    if (error.stack) console.error(error.stack);
  } finally {
    await app.close();
    process.exit(0);
  }
}

bootstrap();
