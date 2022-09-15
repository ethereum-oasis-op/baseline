-- CreateTable
CREATE TABLE "Workstep" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "workgroupId" TEXT NOT NULL,
    "securityPolicy" TEXT,
    "privacyPolicy" TEXT
);
