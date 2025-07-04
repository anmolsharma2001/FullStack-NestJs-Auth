// mail.service.ts
import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    
    //  this.transporter = nodemailer.createTransport({
    //   host: 'smtp.ethereal.email',
    //   port: 587,
    //   auth: {
    //     user: 'peyton.brown@ethereal.email',
    //     pass: 'CC6rz6T3eUAkCbY2U3',
    //   },
    // });

    this.transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'noble90@ethereal.email',
        pass: 'A4kXqy8FkTgnB4YdVG'
    }
});

  }

  async sendPasswordResetEmail(to: string, token: string) {
    const resetLink = `http://localhost:5173/reset-password?token=${token}`;
    // const resetLink = `http://localhost:3000/reset-password?token=${token}`;

    const mailOptions = {
      from: 'Authentication-backend service',
      to: to,
      subject: 'Password Reset Request',
      html: `<p>You requested a password reset. Click the link below to reset your password:</p><p><a href="${resetLink}">Reset Password</a></p>`,
    };

    await this.transporter.sendMail(mailOptions);
  }
}