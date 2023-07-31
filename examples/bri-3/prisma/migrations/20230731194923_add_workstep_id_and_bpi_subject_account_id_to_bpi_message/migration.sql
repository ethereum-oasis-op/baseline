-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "fromBpiSubjectAccountId" TEXT,
ADD COLUMN     "toBpiSubjectAccountId" TEXT,
ADD COLUMN     "workstepId" TEXT;
