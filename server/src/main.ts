import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS, se necessário
  app.enableCors();

  // Iniciar o servidor na porta 3300
  await app.listen(3300);
}
bootstrap();
