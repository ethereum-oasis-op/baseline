/*
  Warnings:

  - Added the required column `workflowId` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workstepId` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "workflowId" TEXT NOT NULL,
ADD COLUMN     "workstepId" TEXT NOT NULL;
