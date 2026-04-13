import { Module, Global } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/adapters/handlebars.adapter';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { MailService } from './mail.service';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get('MAIL_HOST') || 'smtp.gmail.com',
          port: config.get('MAIL_PORT') || 465,
          secure: true, // Switched to 465 SSL connection
          tls: {
            rejectUnauthorized: false,
          },
          auth: {
            user: config.get('MAIL_USER'),
            pass: config.get('MAIL_PASS'),
          },
        },
        defaults: {
          from: `"CRM Notifications" <${config.get('MAIL_USER')}>`,
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailerModule, MailService],
})
export class MailModule { }

// NOTE: If emails are not being delivered, ensure the following env vars are set for the backend:
// MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS
// Example (.env):
// MAIL_HOST=smtp.gmail.com
// MAIL_PORT=465
// MAIL_USER=your-email@gmail.com (must be the gmail account)
// MAIL_PASS=your-16-character-app-password
// ⚠️ CRITICAL: The sender email MUST match MAIL_USER for Gmail SMTP to work correctly
// If emails still don't send:
// 1. Verify MAIL_USER is a valid Gmail account
// 2. Create App Password: https://myaccount.google.com/apppasswords
// 3. Disable "Less Secure App Access" and use App Password instead
// 4. Check backend console logs for specific error messages
