/*
  Warnings:

  - You are about to drop the column `publicKey` on the `BpiSubject` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "KeyType" AS ENUM ('ECDSA', 'EDDSA');

-- AlterTable
ALTER TABLE "BpiSubject" DROP COLUMN "publicKey";

-- CreateTable
CREATE TABLE "PublicKey" (
    "id" TEXT NOT NULL,
    "type" "KeyType" NOT NULL,
    "value" TEXT NOT NULL,
    "bpiSubjectId" TEXT NOT NULL,

    CONSTRAINT "PublicKey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PublicKey_value_key" ON "PublicKey"("value");

-- CreateIndex
CREATE UNIQUE INDEX "PublicKey_type_bpiSubjectId_key" ON "PublicKey"("type", "bpiSubjectId");

-- AddForeignKey
ALTER TABLE "PublicKey" ADD CONSTRAINT "PublicKey_bpiSubjectId_fkey" FOREIGN KEY ("bpiSubjectId") REFERENCES "BpiSubject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
