/*
  Warnings:

  - You are about to drop the column `fromBpiAccountId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `toBpiAccountId` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `fromBpiSubjectAccountId` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toBpiSubjectAccountId` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_fromBpiAccountId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_toBpiAccountId_fkey";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "fromBpiAccountId",
DROP COLUMN "toBpiAccountId",
ADD COLUMN     "fromBpiSubjectAccountId" TEXT NOT NULL,
ADD COLUMN     "toBpiSubjectAccountId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_fromBpiSubjectAccountId_fkey" FOREIGN KEY ("fromBpiSubjectAccountId") REFERENCES "BpiSubjectAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_toBpiSubjectAccountId_fkey" FOREIGN KEY ("toBpiSubjectAccountId") REFERENCES "BpiSubjectAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
