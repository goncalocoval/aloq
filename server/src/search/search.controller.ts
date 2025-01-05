import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  BadRequestException,
} from '@nestjs/common';
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

    // Validação dos critérios
    if (!criteria || criteria.length === 0) {
      throw new BadRequestException('Criteria cannot be empty.');
    }

    const invalidCriteria = criteria.filter(
      (criterion) =>
        !criterion.key ||
        !criterion.priority ||
        criterion.priority < 1 ||
        criterion.priority > 9 ||
        (["hasParking", "hasMeetingRooms", "hasOfficeWithFurniture", "hasTransport", "hasCanteen"].includes(criterion.key) &&
          typeof criterion.value !== "boolean")
    );

    if (invalidCriteria.length > 0) {
      throw new BadRequestException('Some criteria are invalid.');
    }

    const clientId = req.user.clientId;

    // Obter todos os parques do banco de dados
    const parks = await this.searchService.getAllParks();

    // Calcular recomendação usando os critérios
    const result = this.searchService.calculateAHP(criteria, parks);

    // Formatar os resultados para incluir informações adicionais
    const formattedResult = result.map(({ park, score, contributions }) => ({
      park,
      score,
      contributions,
    }));

    // Armazenar a pesquisa no banco de dados
    await this.searchService.saveSearch(clientId, criteria, formattedResult);

    return {
      message: 'Search completed successfully.',
      result: formattedResult,
    };
  }

  @Get('history')
async getSearchHistory(@Request() req: any) {
  const clientId = req.user.clientId;

  // Buscar as últimas 5 pesquisas do cliente
  const history = await this.searchService.getSearchHistory(clientId);

  // Formatar a resposta para o frontend
  const formattedHistory = history.map((entry) => {
    let parsedResult: any[] = [];
    if (Array.isArray(entry.result)) {
      // Se o resultado já é um array
      parsedResult = entry.result;
    } else if (typeof entry.result === 'string') {
      // Se o resultado for uma string JSON, parseia
      try {
        parsedResult = JSON.parse(entry.result);
      } catch (error) {
        console.error('Error parsing result:', error);
        parsedResult = [];
      }
    }

    return {
      id: entry.id,
      criteria: entry.criteria,
      result: parsedResult.map((res: any) => ({
        park: res.park,
        score: res.score,
        contributions: res.contributions,
      })),
      createdAt: entry.createdAt,
    };
  });

  return { history: formattedHistory };
}

}