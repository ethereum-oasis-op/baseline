-- CreateTable
CREATE TABLE "Workflow" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "workgroupId" TEXT NOT NULL,

    CONSTRAINT "Workflow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_WorkflowToWorkstep" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_WorkflowToWorkstep_AB_unique" ON "_WorkflowToWorkstep"("A", "B");

-- CreateIndex
CREATE INDEX "_WorkflowToWorkstep_B_index" ON "_WorkflowToWorkstep"("B");

-- AddForeignKey
ALTER TABLE "_WorkflowToWorkstep" ADD CONSTRAINT "_WorkflowToWorkstep_A_fkey" FOREIGN KEY ("A") REFERENCES "Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WorkflowToWorkstep" ADD CONSTRAINT "_WorkflowToWorkstep_B_fkey" FOREIGN KEY ("B") REFERENCES "Workstep"("id") ON DELETE CASCADE ON UPDATE CASCADE;
