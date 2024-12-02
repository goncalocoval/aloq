import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class EmailService {
    private transporter;

    constructor() {
    this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        user: 'aloqplatform@gmail.com',
        pass: 'dtfm imqd teeg znys',
        },
    });
    }

    async sendVerificationEmail(client: { id: number; email: string }) {
        const token = jwt.sign(
        { clientId: client.id },
        process.env.JWT_SECRET, // Configure uma variável de ambiente segura
        { expiresIn: '30d' } // Expiração do token
        );
    
        const verificationUrl = `${process.env.FRONTEND_URL}/auth/verify-email?token=${token}`;
    
        const mailOptions = {
        from: 'aloqplatform@gmail.com',
        to: client.email,
        subject: 'Verify Your Email',
        text: `Click the link to verify your email: ${verificationUrl}`,
        };
    
        await this.transporter.sendMail(mailOptions);
    }

}
