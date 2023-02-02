/*
  Warnings:

  - You are about to drop the `CCSMAnchorHash` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Document` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CCSMAnchorHash" DROP CONSTRAINT "CCSMAnchorHash_documentId_fkey";

-- DropForeignKey
ALTER TABLE "CCSMAnchorHash" DROP CONSTRAINT "CCSMAnchorHash_ownerBpiSubjectId_fkey";

-- DropTable
DROP TABLE "CCSMAnchorHash";

-- DropTable
DROP TABLE "Document";

-- CreateTable
CREATE TABLE "State" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "State_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnchorHash" (
    "id" TEXT NOT NULL,
    "ownerBpiSubjectId" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "stateId" INTEGER NOT NULL,

    CONSTRAINT "AnchorHash_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AnchorHash_hash_key" ON "AnchorHash"("hash");

-- CreateIndex
CREATE UNIQUE INDEX "AnchorHash_stateId_key" ON "AnchorHash"("stateId");

-- AddForeignKey
ALTER TABLE "AnchorHash" ADD CONSTRAINT "AnchorHash_ownerBpiSubjectId_fkey" FOREIGN KEY ("ownerBpiSubjectId") REFERENCES "BpiSubject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnchorHash" ADD CONSTRAINT "AnchorHash_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "State"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
