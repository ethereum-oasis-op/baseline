-- CreateTable
CREATE TABLE "BpiAccountStateTreeLeafValue" (
    "id" TEXT NOT NULL,
    "bpiAccountId" TEXT NOT NULL,
    "leafIndex" INTEGER NOT NULL,
    "merkelizedPayload" TEXT NOT NULL,
    "witness" TEXT NOT NULL,

    CONSTRAINT "BpiAccountStateTreeLeafValue_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BpiAccountStateTreeLeafValue" ADD CONSTRAINT "BpiAccountStateTreeLeafValue_bpiAccountId_fkey" FOREIGN KEY ("bpiAccountId") REFERENCES "BpiAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
