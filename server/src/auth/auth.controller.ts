import { Controller, Post, Body, Patch, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from './auth.guard';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import * as bcrypt from 'bcrypt';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService, private prisma: PrismaService, private emailService: EmailService) {}

    @Post('register')
    async register(@Body() body: RegisterDto) {
        return this.authService.register(body.name, body.email, body.password);
    }

    @Post('login')
    async login(@Body() body: LoginDto) {
        return this.authService.login(body.email, body.password);
    }

    @Post('request-password-reset')
    async requestPasswordReset(@Body('email') email: string) {
        return this.authService.requestPasswordReset(email);
    }

    @Post('reset-password')
    async resetPassword(@Body('token') token: string, @Body('password') password: string) {
        return this.authService.resetPassword(token, password);
    }

    @Patch('update-client')
    @UseGuards(AuthGuard) // Protege a rota
    async updateClient(
    @Body('name') name: string,
    @Body('password') password: string,
    @Body('details') details: string,
    @Request() req: any, // Para acessar o token JWT do cliente autenticado
    ) {
    try {
        const updates: any = {};
        if (name) updates.name = name;
        if (password) updates.password = await bcrypt.hash(password, 10);
        if (details) updates.details = details;

        await this.prisma.client.update({
        where: { id: req.user.clientId }, // ID do cliente autenticado
        data: updates,
        });

        return { message: 'Profile updated successfully.' };
    } catch (error) {
        console.error('Error updating profile:', error.message);
        throw new Error(error.message);
    }
    }   

}
