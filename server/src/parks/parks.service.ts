import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ParksService {
  constructor(private readonly prisma: PrismaService) {}

  async getUniqueLocations() {
    const parks = await this.prisma.park.findMany({
      select: { location: true },
    });

    // Extrair localizações únicas
    const locations = Array.from(new Set(parks.map((park) => park.location)));
    return { locations };
  }
}