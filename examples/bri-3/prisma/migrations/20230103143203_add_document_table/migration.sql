/*
  Warnings:

  - A unique constraint covering the columns `[documentId]` on the table `CCSMAnchorHash` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `documentId` to the `CCSMAnchorHash` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CCSMAnchorHash" ADD COLUMN     "documentId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Document" (
    "id" SERIAL NOT NULL,
    "document" TEXT NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CCSMAnchorHash_documentId_key" ON "CCSMAnchorHash"("documentId");

-- AddForeignKey
ALTER TABLE "CCSMAnchorHash" ADD CONSTRAINT "CCSMAnchorHash_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
