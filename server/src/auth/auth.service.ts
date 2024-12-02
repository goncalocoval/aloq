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
      
}