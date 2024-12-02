import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module'; // Importar PrismaModule
import { EmailService } from '../email/email.service';

@Module({
  imports: [PrismaModule], // Importar PrismaModule para usar PrismaService
  controllers: [AuthController], // Certifique-se de registrar o AuthController
  providers: [AuthService, EmailService], // Registrar serviços necessários
})
export class AuthModule {}
