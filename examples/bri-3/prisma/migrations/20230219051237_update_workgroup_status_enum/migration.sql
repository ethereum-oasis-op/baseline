/*
  Warnings:

  - The `status` column on the `Workgroup` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "WorkgroupStatus" AS ENUM ('ACTIVE', 'ARCHIVED');

-- AlterTable
ALTER TABLE "Workgroup" DROP COLUMN "status",
ADD COLUMN     "status" "WorkgroupStatus" NOT NULL DEFAULT 'ACTIVE';

-- DropEnum
DROP TYPE "Status";
