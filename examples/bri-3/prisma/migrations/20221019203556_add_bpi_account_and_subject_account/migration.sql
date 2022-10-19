-- CreateTable
CREATE TABLE "BpiAccount" (
    "id" TEXT NOT NULL,
    "nonce" INTEGER NOT NULL,

    CONSTRAINT "BpiAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BpiSubjectAccount" (
    "id" TEXT NOT NULL,
    "creatorBpiSubjectId" TEXT NOT NULL,
    "ownerBpiSubjectId" TEXT NOT NULL,

    CONSTRAINT "BpiSubjectAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BpiAccountToBpiSubjectAccount" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BpiAccountToBpiSubjectAccount_AB_unique" ON "_BpiAccountToBpiSubjectAccount"("A", "B");

-- CreateIndex
CREATE INDEX "_BpiAccountToBpiSubjectAccount_B_index" ON "_BpiAccountToBpiSubjectAccount"("B");

-- AddForeignKey
ALTER TABLE "BpiSubjectAccount" ADD CONSTRAINT "BpiSubjectAccount_creatorBpiSubjectId_fkey" FOREIGN KEY ("creatorBpiSubjectId") REFERENCES "BpiSubject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BpiSubjectAccount" ADD CONSTRAINT "BpiSubjectAccount_ownerBpiSubjectId_fkey" FOREIGN KEY ("ownerBpiSubjectId") REFERENCES "BpiSubject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BpiAccountToBpiSubjectAccount" ADD CONSTRAINT "_BpiAccountToBpiSubjectAccount_A_fkey" FOREIGN KEY ("A") REFERENCES "BpiAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BpiAccountToBpiSubjectAccount" ADD CONSTRAINT "_BpiAccountToBpiSubjectAccount_B_fkey" FOREIGN KEY ("B") REFERENCES "BpiSubjectAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;
