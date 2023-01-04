-- CreateTable
CREATE TABLE "CCSMAnchorHash" (
    "id" TEXT NOT NULL,
    "ownerBpiSubjectId" TEXT NOT NULL,
    "hash" BYTEA NOT NULL,

    CONSTRAINT "CCSMAnchorHash_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CCSMAnchorHash" ADD CONSTRAINT "CCSMAnchorHash_ownerBpiSubjectId_fkey" FOREIGN KEY ("ownerBpiSubjectId") REFERENCES "BpiSubject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
