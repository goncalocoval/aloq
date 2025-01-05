/*
  Warnings:

  - You are about to drop the column `hasOfficeFurniture` on the `Park` table. All the data in the column will be lost.
  - You are about to drop the column `hasTransportAndCanteen` on the `Park` table. All the data in the column will be lost.
  - You are about to drop the column `hasWiFiAndPrinter` on the `Park` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Park" DROP COLUMN "hasOfficeFurniture",
DROP COLUMN "hasTransportAndCanteen",
DROP COLUMN "hasWiFiAndPrinter",
ADD COLUMN     "hasCanteen" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasOfficeWithFurniture" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasTransport" BOOLEAN NOT NULL DEFAULT false;