-- CreateTable
CREATE TABLE "ContentAddressableHash" (
    "id" SERIAL NOT NULL,
    "document" TEXT NOT NULL,

    CONSTRAINT "ContentAddressableHash_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "contentAddressableHashIndex" ON "ContentAddressableHash" USING HASH ("document");
