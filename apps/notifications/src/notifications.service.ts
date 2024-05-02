import { Injectable } from '@nestjs/common';
import { NotifyEmailDto } from './dto';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotificationsService {
  constructor(private readonly configService: ConfigService) {}
  private readonly transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: this.configService.get<string>('SMTP_USER'),
      clientId: this.configService.get<string>('GOOGLE_OAUTH_CLIENT_ID'),
      clientSecret: this.configService.get<string>('GOOGLE_OAUTH_CLIENT_SECRET'),
      refreshToken: this.configService.get<string>('GOOGLE_OAUTH_REFRESH_TOKEN'),
    },
  });

  async notifyEmail({ email, text }: NotifyEmailDto) {
    console.log('🟢====>email', email);
    await this.transporter.sendMail({
      from: this.configService.get<string>('SMTP_USER'),
      to: email,
      subject: 'PAYMENT NOTIFICATION',
      text
    })
  }
}
