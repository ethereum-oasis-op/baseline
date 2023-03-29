/*
  Warnings:

  - You are about to drop the `MerkleTree` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "MerkleTree";

-- CreateTable
CREATE TABLE "BpiMerkleTree" (
    "id" TEXT NOT NULL,
    "merkleTree" JSONB NOT NULL,

    CONSTRAINT "BpiMerkleTree_pkey" PRIMARY KEY ("id")
);
