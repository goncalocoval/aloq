import { Controller, Post, Body, Query, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as jwt from 'jsonwebtoken';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService, private prisma: PrismaService) {}

    @Post('register')
    async register(@Body() body: RegisterDto) {
        return this.authService.register(body.name, body.email, body.password);
    }

    @Get('verify-email')
    async verifyEmail(@Query('token') token: string) {
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET) as { clientId: number };

            await this.prisma.client.update({
            where: { id: payload.clientId },
            data: { isVerified: true },
            });

            return { message: 'Email verified successfully.' };
        } catch (error) {
            console.error('Error verifying email:', error.message);
            throw new Error('Invalid or expired verification token.');
        }
    }

}
