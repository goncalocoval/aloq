import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ClientService {
    constructor(private readonly prisma: PrismaService) {}

    async findClientById(clientId: number) {
        const client = await this.prisma.client.findUnique({
            where: { id: clientId },
        });

        if (!client) {
            throw new BadRequestException('Client not found');
        }

        return client;
    }  

    async getProfile(clientId: number) {
        const client = await this.findClientById(clientId);
        return {
            id: client.id,
            name: client.name,
            email: client.email,
            createdAt: client.createdAt,
            details: client.details,
            isVerified: client.isVerified,
        };
    }  

    async updateDetails(clientId: number, details: string) {
        return this.prisma.client.update({
            where: { id: clientId },
            data: { details },
            select: { id: true, details: true },
        });
    }

    async changePassword(clientId: number, newPassword: string) {
        if (!newPassword || newPassword.length < 6) {
          throw new BadRequestException('Password must be at least 6 characters long');
        }
      
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        return this.prisma.client.update({
          where: { id: clientId },
          data: { password: hashedPassword },
          select: { id: true },
        });
    }
      
}