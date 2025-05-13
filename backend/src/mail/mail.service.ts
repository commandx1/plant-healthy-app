/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable } from '@nestjs/common'
import { createTransport } from 'nodemailer'

@Injectable()
export class MailService {
    private transporter = createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    async sendMail({
        to,
        subject,
        html,
    }: {
        to: string
        subject: string
        html: string
    }) {
        await this.transporter.sendMail({
            from: `"Plant App" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        })
    }
}
