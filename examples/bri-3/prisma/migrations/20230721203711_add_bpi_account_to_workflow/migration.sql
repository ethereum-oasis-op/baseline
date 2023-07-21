/*
  Warnings:

  - Added the required column `bpiAccountId` to the `Workflow` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Workflow" ADD COLUMN     "bpiAccountId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Workflow" ADD CONSTRAINT "Workflow_bpiAccountId_fkey" FOREIGN KEY ("bpiAccountId") REFERENCES "BpiAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
