-- CreateTable
CREATE TABLE "CaseOpening" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "caseName" TEXT NOT NULL,
    "casePrice" REAL NOT NULL,
    "itemName" TEXT NOT NULL,
    "itemRarity" TEXT NOT NULL,
    "itemValue" REAL NOT NULL,
    "profit" REAL NOT NULL,
    "openedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CaseOpening_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "CaseOpening_userId_openedAt_idx" ON "CaseOpening"("userId", "openedAt");
