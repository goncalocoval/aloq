// Corrections to SearchService
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
  hasOfficeWithFurniture: boolean;
  hasTransport: boolean;
  hasCanteen: boolean;
}

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllParks() {
    return this.prisma.park.findMany();
  }

  calculateAHP(criteria: Criterion[], parks: Park[]) {
    const priorities = criteria.map((c) => c.priority);

    if (priorities.some((p) => p < 1 || p > 9)) {
      const invalidPriorities = priorities.filter((p) => p < 1 || p > 9);
      throw new Error(`Invalid priorities: ${invalidPriorities.join(", ")}. All priorities must be between 1 and 9.`);
    }

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
    const weights = normalizedMatrix.map(
      (row) => row.reduce((sum, value) => sum + value, 0) / normalizedMatrix.length
    );

    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);

    return weights.map((weight) => weight / totalWeight); // Normalização global
  }

  private rankParks(
    weights: number[],
    criteria: { key: string; value: any; priority: number }[],
    parks: any[]
  ) {
    const scores = parks.map((park) => {
      let score = 0;
      const contributions: Record<string, number> = {};

      criteria.forEach((criterion, index) => {
        const { key, value } = criterion;
        let contribution = 0;

        if (key === "cost") {
          if (park.cost <= value) {
            contribution = weights[index];
          } else {
            const penalty = 1 - (park.cost - value) / value;
            contribution = weights[index] * Math.max(penalty, 0);
          }
        } else if (key === "location" && value.includes(park.location)) {
          contribution = weights[index];
        } else if (
          [
            "hasParking",
            "hasMeetingRooms",
            "hasOfficeWithFurniture",
            "hasTransport",
            "hasCanteen",
          ].includes(key)
        ) {
          contribution = park[key] === value ? weights[index] : 0; // Correção aqui
        }

        score += contribution;
        contributions[key] = contribution;
      });

      return { park, rawScore: score, contributions };
    });

    const totalScore = scores.reduce((sum, { rawScore }) => sum + rawScore, 0);

    if (totalScore === 0) {
      return []; // Retorna vazio se nenhum parque for elegível
    }

    return scores.map(({ park, rawScore, contributions }) => ({
      park,
      score: rawScore / totalScore, // Normaliza o score
      contributions: Object.fromEntries(
        Object.entries(contributions).map(([key, value]) => [
          key,
          value / rawScore, // Normaliza as contribuições por parque
        ])
      ),
    }));
  }

  async saveSearch(clientId: number, criteria: any, result: any) {
    const validatedCriteria = JSON.stringify(criteria);
    const validatedResult = JSON.stringify(result);

    await this.prisma.search.create({
      data: {
        clientId,
        criteria: validatedCriteria,
        result: validatedResult,
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
