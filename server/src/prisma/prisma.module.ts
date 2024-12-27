import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Define o módulo como global
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Exporta o PrismaService para outros módulos
})
export class PrismaModule {}
