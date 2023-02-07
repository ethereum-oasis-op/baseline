-- CreateTable
CREATE TABLE "AnchorHash" (
    "id" TEXT NOT NULL,
    "ownerBpiSubjectId" TEXT NOT NULL,
    "hash" TEXT NOT NULL,

    CONSTRAINT "AnchorHash_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AnchorHash_hash_key" ON "AnchorHash"("hash");

-- AddForeignKey
ALTER TABLE "AnchorHash" ADD CONSTRAINT "AnchorHash_ownerBpiSubjectId_fkey" FOREIGN KEY ("ownerBpiSubjectId") REFERENCES "BpiSubject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
