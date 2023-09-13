/*
  Warnings:

  - Added the required column `historyTreeId` to the `BpiAccount` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BpiAccount" ADD COLUMN     "historyTreeId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "BpiAccount" ADD CONSTRAINT "BpiAccount_historyTreeId_fkey" FOREIGN KEY ("historyTreeId") REFERENCES "BpiMerkleTree"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
