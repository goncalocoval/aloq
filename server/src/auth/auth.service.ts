import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
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
        throw new Error('Email is already registered.');
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
      throw error;
    }

  }

  async login(email: string, password: string) {

    try {
      // Verificar se o email está registrado
      const client = await this.prisma.client.findUnique({
        where: { email },
      });

      if (!client) {
        throw new Error('Invalid email or password.');
      }
    
      // Verificar senha
      const passwordMatch = await bcrypt.compare(password, client.password);
    
      if (!passwordMatch) {
        throw new Error('Invalid email or password.');
      }
    
      // Gerar token de autenticação
      const token = jwt.sign({ clientId: client.id }, process.env.JWT_SECRET, { expiresIn: '12h' });
    
      return { token, message: 'Login successful.' };

    } catch (error) {
      console.error('Error during login:', error.message);
      throw error;
    }

  }

  async requestPasswordReset(email: string) {

    try {
      const client = await this.prisma.client.findUnique({ where: { email } });

      if (!client) {
          throw new Error('Email not found.');
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
      throw new Error(error.message);
    }

  }

  async resetPassword(token: string, password: string) {

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET) as { clientId: number };

      const hashedPassword = await bcrypt.hash(password, 10);

      await this.prisma.client.update({
        where: { id: payload.clientId },
        data: { password: hashedPassword },
      });

      return { message: 'Password updated successfully.' };
    } catch (error) {
      console.error('Error during password reset:', error.message);
      throw new Error('Invalid or expired token.');
    }
    
  }
      
}