import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Dados para popular a tabela Park
  const parks = [
    {
      name: "TechPark One",
      cost: 500,
      location: "Lisboa",
      hasParking: true,
      hasMeetingRooms: true,
      hasOfficeWithFurniture: true,
      hasTransport: false,
      hasCanteen: true,
    },
    {
      name: "Innovation Hub",
      cost: 800,
      location: "Porto",
      hasParking: true,
      hasMeetingRooms: true,
      hasOfficeWithFurniture: false,
      hasTransport: true,
      hasCanteen: false,
    },
    {
      name: "Green Valley Center",
      cost: 700,
      location: "Braga",
      hasParking: true,
      hasMeetingRooms: false,
      hasOfficeWithFurniture: true,
      hasTransport: true,
      hasCanteen: true,
    },
    {
      name: "Startup Zone",
      cost: 600,
      location: "Coimbra",
      hasParking: false,
      hasMeetingRooms: true,
      hasOfficeWithFurniture: true,
      hasTransport: false,
      hasCanteen: true,
    },
    {
      name: "OceanView Tech Park",
      cost: 1000,
      location: "Aveiro",
      hasParking: true,
      hasMeetingRooms: true,
      hasOfficeWithFurniture: true,
      hasTransport: true,
      hasCanteen: true,
    },
  ];

  // Verificar se já existem registros na tabela Park
  const existingParks = await prisma.park.findMany();
  if (existingParks.length > 0) {
    console.log("Parks already exist. Skipping seed.");
    return;
  }

  // Inserir dados na tabela Park
  await prisma.park.createMany({
    data: parks,
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });