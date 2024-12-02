import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module'; // Importar o AuthModule

@Module({
  imports: [AuthModule], // Certifique-se de que o AuthModule está listado aqui
})
export class AppModule {}
