-- CreateTable
CREATE TABLE "Park" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "cost" DECIMAL(10,2) NOT NULL,
    "location" TEXT NOT NULL,
    "hasParking" BOOLEAN NOT NULL,
    "hasMeetingRooms" BOOLEAN NOT NULL,
    "hasOfficeFurniture" BOOLEAN NOT NULL,
    "hasWiFiAndPrinter" BOOLEAN NOT NULL,
    "hasTransportAndCanteen" BOOLEAN NOT NULL,

    CONSTRAINT "Park_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Search" (
    "id" SERIAL NOT NULL,
    "clientId" INTEGER NOT NULL,
    "criteria" JSONB NOT NULL,
    "result" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Search_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Search" ADD CONSTRAINT "Search_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
