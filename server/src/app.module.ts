import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module'; // Importar o AuthModule
import { SearchModule } from './search/search.module';
import { ClientModule } from './client/client.module';
import { ParksModule } from './parks/parks.module';

@Module({
  imports: [AuthModule, SearchModule, ClientModule, ParksModule],
  controllers: [], // Certifique-se de que o AuthModule está listado aqui
})
export class AppModule {}
