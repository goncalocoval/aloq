import { Body, Controller, Post, UseGuards, Request, Get, BadRequestException } from '@nestjs/common';
import { SearchService } from './search.service';
import { AuthGuard } from '../auth/auth.guard';

interface Criterion {
  key: string;
  value: any;
  priority: number;
}

@Controller('search')
@UseGuards(AuthGuard)
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Post()
  async createSearch(
    @Request() req: any,
    @Body('criteria') criteria: Criterion[]
  ) {

    if (!criteria || criteria.length === 0) {
      throw new BadRequestException('Criteria cannot be empty.');
    }
  
    const invalidCriteria = criteria.filter(
      (criterion) =>
        !criterion.key || !criterion.priority || criterion.priority < 1 || criterion.priority > 9
    );
  
    if (invalidCriteria.length > 0) {
      throw new BadRequestException('Some criteria are invalid.');
    }
    
    const clientId = req.user.clientId;

    // Obter todos os parques do banco de dados
    const parks = await this.searchService.getAllParks();

    // Calcular recomendação usando os critérios
    const result = this.searchService.calculateAHP(criteria, parks);

    // Armazenar a pesquisa no banco de dados
    await this.searchService.saveSearch(clientId, criteria, result);

    return { message: 'Search completed successfully.', result };
  }

  @Get('history')
  async getSearchHistory(@Request() req: any) {
    const clientId = req.user.clientId;

    // Buscar as últimas 5 pesquisas do cliente
    const history = await this.searchService.getSearchHistory(clientId);

    return { history };
  }

}
