-- CreateTable
CREATE TABLE "BpiSubjectRole" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "BpiSubjectRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BpiSubjectToBpiSubjectRole" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BpiSubjectToBpiSubjectRole_AB_unique" ON "_BpiSubjectToBpiSubjectRole"("A", "B");

-- CreateIndex
CREATE INDEX "_BpiSubjectToBpiSubjectRole_B_index" ON "_BpiSubjectToBpiSubjectRole"("B");

-- AddForeignKey
ALTER TABLE "_BpiSubjectToBpiSubjectRole" ADD CONSTRAINT "_BpiSubjectToBpiSubjectRole_A_fkey" FOREIGN KEY ("A") REFERENCES "BpiSubject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BpiSubjectToBpiSubjectRole" ADD CONSTRAINT "_BpiSubjectToBpiSubjectRole_B_fkey" FOREIGN KEY ("B") REFERENCES "BpiSubjectRole"("id") ON DELETE CASCADE ON UPDATE CASCADE;
