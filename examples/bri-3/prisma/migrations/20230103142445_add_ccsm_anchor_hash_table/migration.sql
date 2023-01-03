-- CreateTable
CREATE TABLE "Document" (
    "id" SERIAL NOT NULL,
    "document" TEXT NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnchorHash" (
    "id" SERIAL NOT NULL,
    "ownerBpiSubjectId" TEXT NOT NULL,
    "hash" BYTEA NOT NULL,
    "documentId" INTEGER NOT NULL,

    CONSTRAINT "AnchorHash_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AnchorHash_documentId_key" ON "AnchorHash"("documentId");

-- AddForeignKey
ALTER TABLE "AnchorHash" ADD CONSTRAINT "AnchorHash_ownerBpiSubjectId_fkey" FOREIGN KEY ("ownerBpiSubjectId") REFERENCES "BpiSubject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnchorHash" ADD CONSTRAINT "AnchorHash_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
