/*
  Warnings:

  - A unique constraint covering the columns `[signature]` on the table `AnchorHash` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `signature` to the `AnchorHash` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AnchorHash" ADD COLUMN     "signature" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AnchorHash_signature_key" ON "AnchorHash"("signature");
