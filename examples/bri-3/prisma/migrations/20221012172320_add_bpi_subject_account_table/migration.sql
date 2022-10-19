-- CreateTable
CREATE TABLE "BpiSubjectAccount" (
    "id" TEXT NOT NULL,
    "creatorBpiSubjectId" TEXT NOT NULL,
    "ownerBpiSubjectId" TEXT NOT NULL,

    CONSTRAINT "BpiSubjectAccount_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BpiSubjectAccount" ADD CONSTRAINT "BpiSubjectAccount_creatorBpiSubjectId_fkey" FOREIGN KEY ("creatorBpiSubjectId") REFERENCES "BpiSubject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BpiSubjectAccount" ADD CONSTRAINT "BpiSubjectAccount_ownerBpiSubjectId_fkey" FOREIGN KEY ("ownerBpiSubjectId") REFERENCES "BpiSubject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
