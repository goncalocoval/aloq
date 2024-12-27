import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';

interface Criterion {
  key: string;
  value: any;
  priority: number;
}

interface Park {
  id: number;
  name: string;
  cost: Decimal;
  location: string;
  hasParking: boolean;
  hasMeetingRooms: boolean;
  hasOfficeFurniture: boolean;
  hasWiFiAndPrinter: boolean;
  hasTransportAndCanteen: boolean;
}

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllParks() {
    return this.prisma.park.findMany();
  }

  calculateAHP(criteria: Criterion[], parks: Park[]) {
    const criteriaKeys = criteria.map((c) => c.key);
    const priorities = criteria.map((c) => c.priority);

    // Passo 1: Criar Matriz de Comparação
    const comparisonMatrix = this.createComparisonMatrix(priorities);

    // Passo 2: Normalizar a Matriz
    const normalizedMatrix = this.normalizeMatrix(comparisonMatrix);

    // Passo 3: Calcular Pesos
    const weights = this.calculateWeights(normalizedMatrix);

    // Passo 4: Aplicar Pesos e Filtrar Parques
    return this.rankParks(weights, criteria, parks);
  }

  private createComparisonMatrix(priorities: number[]) {
    const matrix = [];
    for (let i = 0; i < priorities.length; i++) {
      const row = [];
      for (let j = 0; j < priorities.length; j++) {
        row.push(priorities[i] / priorities[j]);
      }
      matrix.push(row);
    }
    return matrix;
  }

  private normalizeMatrix(matrix: number[][]) {
    const size = matrix.length;
    const columnSums = Array(size).fill(0);

    for (let j = 0; j < size; j++) {
      for (let i = 0; i < size; i++) {
        columnSums[j] += matrix[i][j];
      }
    }

    return matrix.map((row) =>
      row.map((value, j) => value / columnSums[j])
    );
  }

  private calculateWeights(normalizedMatrix: number[][]) {
    return normalizedMatrix.map(
      (row) => row.reduce((sum, value) => sum + value, 0) / normalizedMatrix.length
    );
  }

  private rankParks(
    weights: number[],
    criteria: { key: string; value: any; priority: number }[],
    parks: any[]
  ) {
    return parks
      .map((park) => {
        let score = 0;

        criteria.forEach((criterion, index) => {
          const { key, value } = criterion;

          // Aplicar filtros e pesos
          if (key === 'cost' && park.cost <= value) {
            score += weights[index];
          } else if (key === 'location' && value.includes(park.location)) {
            score += weights[index];
          } else if (key === 'hasParking' && park.hasParking === value) {
            score += weights[index];
          } else if (key === 'hasMeetingRooms' && park.hasMeetingRooms === value) {
            score += weights[index];
          } else if (key === 'hasOfficeFurniture' && park.hasOfficeFurniture === value) {
            score += weights[index];
          } else if (key === 'hasWiFiAndPrinter' && park.hasWiFiAndPrinter === value) {
            score += weights[index];
          } else if (
            key === 'hasTransportAndCanteen' &&
            park.hasTransportAndCanteen === value
          ) {
            score += weights[index];
          }          
        });

        return { park, score };
      })
      .sort((a, b) => b.score - a.score); // Ordenar por pontuação decrescente
  }

  async saveSearch(clientId: number, criteria: any, result: any) {
    await this.prisma.search.create({
      data: {
        clientId,
        criteria,
        result,
      },
    });
  }

  async getSearchHistory(clientId: number) {
    return this.prisma.search.findMany({
      where: { clientId },
      orderBy: { createdAt: 'desc' }, // Ordenar por data de criação (mais recentes primeiro)
      take: 5, // Limitar ao máximo 5 resultados
    });
  }
  
}
