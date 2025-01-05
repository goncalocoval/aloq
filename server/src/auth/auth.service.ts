import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {

  constructor(private prisma: PrismaService, private emailService: EmailService) {}

  async register(name: string, email: string, password: string) {
    try {
      // Verificar se o email já está registrado
      const existingClient = await this.prisma.client.findUnique({
        where: { email },
      });
  
      if (existingClient) {
        throw new BadRequestException('Email is already registered.');
      }
  
      // Hash da senha
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Criar cliente
      const client = await this.prisma.client.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });
  
      // Enviar email de verificação
      await this.emailService.sendVerificationEmail(client);
  
      return { message: 'Client registered. Verification email sent.' };
    } catch (error) {
      console.error('Error during registration:', error.message);
  
      if (error instanceof BadRequestException) {
        throw error; // Relança a exceção com a mensagem apropriada
      }
  
      throw new BadRequestException('An error occurred during registration.');
    }
  }

  async login(email: string, password: string) {
    try {
      // Verificar se o email está registrado
      const client = await this.prisma.client.findUnique({
        where: { email },
      });
  
      if (!client) {
        throw new UnauthorizedException('Invalid email or password.');
      }
  
      // Verificar senha
      const passwordMatch = await bcrypt.compare(password, client.password);
  
      if (!passwordMatch) {
        throw new UnauthorizedException('Invalid email or password.');
      }
  
      // Gerar token de autenticação
      const token = jwt.sign(
        { clientId: client.id },
        process.env.JWT_SECRET,
        { expiresIn: '12h' },
      );
  
      return { token, message: 'Login successful.' };
    } catch (error) {
      console.error('Error during login:', error.message);
  
      if (error instanceof UnauthorizedException) {
        throw error; // Relança a exceção com a mensagem apropriada
      }
  
      throw new UnauthorizedException('An error occurred during login.');
    }
  }  

  async requestPasswordReset(email: string) {
    try {
      const client = await this.prisma.client.findUnique({ where: { email } });
  
      if (!client) {
        throw new NotFoundException('Email not found.'); // Lança um erro específico com status 404
      }
  
      const token = jwt.sign(
        { clientId: client.id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' } // Token válido por 1 hora
      );
  
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  
      // Enviar email
      await this.emailService.sendMail({
        from: 'aloqplatform@gmail.com',
        to: email,
        subject: 'Reset Your Password',
        text: `Click here to reset your password: ${resetUrl}`,
      });
  
      return { message: 'Password reset email sent.' };
    } catch (error) {
      console.error('Error during password reset request:', error.message);
  
      if (error instanceof NotFoundException) {
        throw error; // Reencaminha o erro específico
      }
  
      // Lança um erro genérico para outros casos
      throw new InternalServerErrorException('An unexpected error occurred.');
    }
  }

  async resetPassword(token: string, password: string) {
    try {
      // Verifica o token
      const payload = jwt.verify(token, process.env.JWT_SECRET) as { clientId: number };

      // Criptografa a nova senha
      const hashedPassword = await bcrypt.hash(password, 10);

      // Atualiza a senha no banco de dados
      await this.prisma.client.update({
        where: { id: payload.clientId },
        data: { password: hashedPassword },
      });

      return { message: 'Password updated successfully.' };
    } catch (error) {
      console.error('Error during password reset:', error.message);

      // Lança um erro com a mensagem simplificada para token inválido ou expirado
      throw new HttpException(
        'Invalid or expired token. Please, request a new password reset.',
        HttpStatus.BAD_REQUEST, // 400
      );
    }
  }
      
}