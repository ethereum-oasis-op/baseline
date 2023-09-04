/*
  Warnings:

  - A unique constraint covering the columns `[leafValue]` on the table `BpiAccountStateTreeLeafValue` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "BpiAccountStateTreeLeafValue_leafValue_key" ON "BpiAccountStateTreeLeafValue"("leafValue");
