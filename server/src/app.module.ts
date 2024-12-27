import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module'; // Importar o AuthModule
import { SearchModule } from './search/search.module';
import { ClientModule } from './client/client.module';

@Module({
  imports: [AuthModule, SearchModule, ClientModule], // Certifique-se de que o AuthModule está listado aqui
})
export class AppModule {}
