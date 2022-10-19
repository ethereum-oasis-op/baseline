-- CreateTable
CREATE TABLE "Workgroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "securityPolicy" TEXT NOT NULL,
    "privacyPolicy" TEXT NOT NULL,

    CONSTRAINT "Workgroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdministratorsOnWorkgroups" (
    "workgroupId" TEXT NOT NULL,
    "administratorId" TEXT NOT NULL,

    CONSTRAINT "AdministratorsOnWorkgroups_pkey" PRIMARY KEY ("workgroupId","administratorId")
);

-- AddForeignKey
ALTER TABLE "Workflow" ADD CONSTRAINT "Workflow_workgroupId_fkey" FOREIGN KEY ("workgroupId") REFERENCES "Workgroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdministratorsOnWorkgroups" ADD CONSTRAINT "AdministratorsOnWorkgroups_workgroupId_fkey" FOREIGN KEY ("workgroupId") REFERENCES "Workgroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdministratorsOnWorkgroups" ADD CONSTRAINT "AdministratorsOnWorkgroups_administratorId_fkey" FOREIGN KEY ("administratorId") REFERENCES "BpiSubject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
