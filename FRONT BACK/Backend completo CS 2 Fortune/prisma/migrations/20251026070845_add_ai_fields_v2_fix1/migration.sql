-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AIUsageLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "tokensUsed" INTEGER NOT NULL,
    "cost" REAL NOT NULL,
    "endpoint" TEXT,
    "success" BOOLEAN NOT NULL DEFAULT true,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AIUsageLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FeatureRollout" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "featureName" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "rolloutPercent" REAL NOT NULL DEFAULT 0,
    "allowedUserIds" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT,
    "username" TEXT,
    "password" TEXT,
    "balance" REAL NOT NULL DEFAULT 0.0,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "plan" TEXT NOT NULL DEFAULT 'free',
    "twoFASecret" TEXT,
    "twoFAEnabled" BOOLEAN NOT NULL DEFAULT false,
    "steamId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "aiModel" TEXT DEFAULT 'gpt-3.5-turbo',
    "aiQuota" INTEGER NOT NULL DEFAULT 10000,
    "aiUsage" INTEGER NOT NULL DEFAULT 0,
    "aiUsageResetAt" DATETIME,
    "aiTotalCost" REAL NOT NULL DEFAULT 0,
    "gpt5Access" BOOLEAN NOT NULL DEFAULT false,
    "betaAccess" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_User" ("balance", "createdAt", "email", "id", "isAdmin", "password", "steamId", "twoFAEnabled", "twoFASecret", "updatedAt", "username") SELECT "balance", "createdAt", "email", "id", "isAdmin", "password", "steamId", "twoFAEnabled", "twoFASecret", "updatedAt", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "User_steamId_key" ON "User"("steamId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE INDEX "AIUsageLog_userId_timestamp_idx" ON "AIUsageLog"("userId", "timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "FeatureRollout_featureName_key" ON "FeatureRollout"("featureName");
