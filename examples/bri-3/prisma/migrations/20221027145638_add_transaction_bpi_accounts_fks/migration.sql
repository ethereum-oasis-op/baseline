/*
  Warnings:

  - You are about to drop the column `from` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `to` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `fromBpiAccountId` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toBpiAccountId` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "from",
DROP COLUMN "to",
ADD COLUMN     "fromBpiAccountId" TEXT NOT NULL,
ADD COLUMN     "toBpiAccountId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_fromBpiAccountId_fkey" FOREIGN KEY ("fromBpiAccountId") REFERENCES "BpiAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_toBpiAccountId_fkey" FOREIGN KEY ("toBpiAccountId") REFERENCES "BpiAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
