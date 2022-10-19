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
ALTER TABLE "_BpiAccountToBpiSubjectAccount" ADD CONSTRAINT "_BpiAccountToBpiSubjectAccount_A_fkey" FOREIGN KEY ("A") REFERENCES "BpiAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BpiAccountToBpiSubjectAccount" ADD CONSTRAINT "_BpiAccountToBpiSubjectAccount_B_fkey" FOREIGN KEY ("B") REFERENCES "BpiSubjectAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;
