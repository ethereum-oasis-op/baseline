-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fromBpiSubjectId" TEXT NOT NULL,
    "toBpiSubjectId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "signature" TEXT NOT NULL,
    "type" INTEGER NOT NULL,
    CONSTRAINT "Message_fromBpiSubjectId_fkey" FOREIGN KEY ("fromBpiSubjectId") REFERENCES "BpiSubject" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Message_toBpiSubjectId_fkey" FOREIGN KEY ("toBpiSubjectId") REFERENCES "BpiSubject" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
