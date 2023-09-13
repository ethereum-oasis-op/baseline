/*
  Warnings:

  - You are about to drop the column `stateObjectStorage` on the `BpiAccount` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BpiAccount" DROP COLUMN "stateObjectStorage";

-- CreateTable
CREATE TABLE "StateTreeNode" (
    "id" SERIAL NOT NULL,
    "path" TEXT NOT NULL,
    "depth" INTEGER NOT NULL,
    "numchild" INTEGER NOT NULL DEFAULT 0,
    "bpiAccountId" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "StateTreeNode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StateTreeNode_path_key" ON "StateTreeNode"("path");

-- CreateIndex
CREATE INDEX "StateTreeNode_path_idx" ON "StateTreeNode"("path");

-- AddForeignKey
ALTER TABLE "StateTreeNode" ADD CONSTRAINT "StateTreeNode_bpiAccountId_fkey" FOREIGN KEY ("bpiAccountId") REFERENCES "BpiAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
