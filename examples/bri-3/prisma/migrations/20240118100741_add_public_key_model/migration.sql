/*
  Warnings:

  - You are about to drop the column `publicKey` on the `BpiSubject` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BpiSubject" DROP COLUMN "publicKey";

-- CreateTable
CREATE TABLE "PublicKey" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "bpiSubjectId" TEXT NOT NULL,

    CONSTRAINT "PublicKey_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PublicKey" ADD CONSTRAINT "PublicKey_bpiSubjectId_fkey" FOREIGN KEY ("bpiSubjectId") REFERENCES "BpiSubject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
