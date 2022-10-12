-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nonce" INTEGER NOT NULL,
    "workflowInstanceId" TEXT NOT NULL,
    "workstepInstanceId" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "payload" TEXT NOT NULL,
    "signature" TEXT NOT NULL,
    "status" INTEGER NOT NULL
);
