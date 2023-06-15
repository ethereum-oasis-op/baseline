-- CreateTable
CREATE TABLE "BpiMerkleTree" (
    "id" TEXT NOT NULL,
    "hashAlgName" TEXT NOT NULL,
    "tree" TEXT NOT NULL,

    CONSTRAINT "BpiMerkleTree_pkey" PRIMARY KEY ("id")
);
