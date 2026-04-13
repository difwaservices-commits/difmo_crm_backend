import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
	private transporter: nodemailer.Transporter;
	private readonly logger = new Logger(EmailService.name);

	constructor(private readonly configService: ConfigService) {
		const host = this.configService.get('MAIL_HOST') || 'smtp.gmail.com';
		const port = Number(this.configService.get('MAIL_PORT') || 465);
		const user = this.configService.get('MAIL_USER');
		const pass = this.configService.get('MAIL_PASS');

		this.transporter = nodemailer.createTransport({
			host,
			port,
			secure: port === 465,
			auth: user && pass ? { user, pass } : undefined,
			tls: { rejectUnauthorized: false },
		} as any);

		this.transporter.verify()
			.then(() => this.logger.log('SMTP transporter verified'))
			.catch(err => this.logger.warn('SMTP verification failed: ' + (err?.message || err)));
	}

	async sendLeaveStatusEmail(to: string, subject: string, text: string, metadata: any = {}): Promise<any> {
		const html = `<p>${text}</p>${metadata?.comment ? `<p><strong>Admin Note:</strong> ${metadata.comment}</p>` : ''}`;
		try {
			const info = await this.transporter.sendMail({
				from: this.configService.get('MAIL_USER'),
				to,
				subject,
				text,
				html,
			});
            
			this.logger.log(`Leave status email sent to ${to}: ${info?.messageId || info?.response}`);
			return info;
		} catch (err) {
			this.logger.error(`Failed to send leave email to ${to}: ${err?.message || err}`);
			throw err;
		}
	}
}

