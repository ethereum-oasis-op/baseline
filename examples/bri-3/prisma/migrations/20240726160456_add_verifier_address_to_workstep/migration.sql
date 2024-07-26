/*
  Warnings:

  - Added the required column `verifierContractAddress` to the `Workstep` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Workstep" ADD COLUMN     "verifierContractAddress" TEXT NOT NULL;
