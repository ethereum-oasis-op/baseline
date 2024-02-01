/*
  Warnings:

  - Changed the type of `type` on the `PublicKey` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "KeyType" AS ENUM ('ECDSA', 'EDDSA');

-- AlterTable
ALTER TABLE "PublicKey" DROP COLUMN "type",
ADD COLUMN     "type" "KeyType" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PublicKey_type_bpiSubjectId_key" ON "PublicKey"("type", "bpiSubjectId");
