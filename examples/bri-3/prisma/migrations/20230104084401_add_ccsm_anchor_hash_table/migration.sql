-- CreateTable
CREATE TABLE "CCSMAnchorHash" (
    "id" TEXT NOT NULL,
    "ownerBpiSubjectId" TEXT NOT NULL,
    "hash" TEXT NOT NULL,

    CONSTRAINT "CCSMAnchorHash_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CCSMAnchorHash_hash_key" ON "CCSMAnchorHash"("hash");

-- AddForeignKey
ALTER TABLE "CCSMAnchorHash" ADD CONSTRAINT "CCSMAnchorHash_ownerBpiSubjectId_fkey" FOREIGN KEY ("ownerBpiSubjectId") REFERENCES "BpiSubject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
