-- CreateTable
CREATE TABLE "Workgroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "securityPolicy" TEXT NOT NULL,
    "privacyPolicy" TEXT NOT NULL,

    CONSTRAINT "Workgroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_administratorSubjects" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_participantSubjects" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_administratorSubjects_AB_unique" ON "_administratorSubjects"("A", "B");

-- CreateIndex
CREATE INDEX "_administratorSubjects_B_index" ON "_administratorSubjects"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_participantSubjects_AB_unique" ON "_participantSubjects"("A", "B");

-- CreateIndex
CREATE INDEX "_participantSubjects_B_index" ON "_participantSubjects"("B");

-- AddForeignKey
ALTER TABLE "Workstep" ADD CONSTRAINT "Workstep_workgroupId_fkey" FOREIGN KEY ("workgroupId") REFERENCES "Workgroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workflow" ADD CONSTRAINT "Workflow_workgroupId_fkey" FOREIGN KEY ("workgroupId") REFERENCES "Workgroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_administratorSubjects" ADD CONSTRAINT "_administratorSubjects_A_fkey" FOREIGN KEY ("A") REFERENCES "BpiSubject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_administratorSubjects" ADD CONSTRAINT "_administratorSubjects_B_fkey" FOREIGN KEY ("B") REFERENCES "Workgroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_participantSubjects" ADD CONSTRAINT "_participantSubjects_A_fkey" FOREIGN KEY ("A") REFERENCES "BpiSubject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_participantSubjects" ADD CONSTRAINT "_participantSubjects_B_fkey" FOREIGN KEY ("B") REFERENCES "Workgroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
