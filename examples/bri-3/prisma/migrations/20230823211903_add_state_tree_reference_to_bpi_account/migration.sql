/*
  Warnings:

  - You are about to drop the column `stateObjectStorage` on the `BpiAccount` table. All the data in the column will be lost.
  - Added the required column `stateTreeId` to the `BpiAccount` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BpiAccount" DROP COLUMN "stateObjectStorage",
ADD COLUMN     "stateTreeId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "BpiAccount" ADD CONSTRAINT "BpiAccount_stateTreeId_fkey" FOREIGN KEY ("stateTreeId") REFERENCES "BpiMerkleTree"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
