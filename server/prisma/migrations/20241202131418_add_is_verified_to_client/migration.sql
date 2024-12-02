/*
  Warnings:

  - You are about to drop the column `isActive` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the `EmailVerification` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Client" DROP COLUMN "isActive",
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "EmailVerification";
