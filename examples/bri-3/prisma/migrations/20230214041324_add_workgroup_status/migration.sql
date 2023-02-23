-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'ARCHIVED');

-- AlterTable
ALTER TABLE "Workgroup" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ACTIVE';
