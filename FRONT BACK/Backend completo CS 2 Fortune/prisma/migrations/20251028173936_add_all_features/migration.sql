/*
  Warnings:

  - Added the required column `clientSeed` to the `CaseOpening` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nonce` to the `CaseOpening` table without a default value. This is not possible if the table is not empty.
  - Added the required column `result` to the `CaseOpening` table without a default value. This is not possible if the table is not empty.
  - Added the required column `resultHash` to the `CaseOpening` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serverSeed` to the `CaseOpening` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serverSeedHash` to the `CaseOpening` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "InventoryItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "skinName" TEXT NOT NULL,
    "skinImage" TEXT,
    "rarity" TEXT NOT NULL,
    "value" REAL NOT NULL,
    "acquiredAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sold" BOOLEAN NOT NULL DEFAULT false,
    "soldAt" DATETIME,
    "soldPrice" REAL,
    CONSTRAINT "InventoryItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Battle" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mode" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "caseName" TEXT NOT NULL,
    "casePrice" REAL NOT NULL,
    "rounds" INTEGER NOT NULL DEFAULT 1,
    "costPerPlayer" REAL NOT NULL,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'waiting',
    "winnerId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedAt" DATETIME,
    "finishedAt" DATETIME
);

-- CreateTable
CREATE TABLE "BattleParticipant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "battleId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "totalValue" REAL NOT NULL DEFAULT 0,
    "isWinner" BOOLEAN NOT NULL DEFAULT false,
    "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BattleParticipant_battleId_fkey" FOREIGN KEY ("battleId") REFERENCES "Battle" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BattleParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BattleResult" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "battleId" TEXT NOT NULL,
    "round" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "itemName" TEXT NOT NULL,
    "itemValue" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BattleResult_battleId_fkey" FOREIGN KEY ("battleId") REFERENCES "Battle" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Achievement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "rewardType" TEXT NOT NULL,
    "rewardValue" REAL NOT NULL,
    "requirement" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "UserAchievement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "achievementId" TEXT NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" DATETIME,
    "claimed" BOOLEAN NOT NULL DEFAULT false,
    "claimedAt" DATETIME,
    CONSTRAINT "UserAchievement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserAchievement_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES "Achievement" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DailyReward" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "day" INTEGER NOT NULL,
    "rewardType" TEXT NOT NULL,
    "rewardValue" REAL NOT NULL,
    "claimedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DailyReward_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CaseOpening" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "caseName" TEXT NOT NULL,
    "casePrice" REAL NOT NULL,
    "itemName" TEXT NOT NULL,
    "itemRarity" TEXT NOT NULL,
    "itemValue" REAL NOT NULL,
    "profit" REAL NOT NULL,
    "serverSeed" TEXT NOT NULL,
    "serverSeedHash" TEXT NOT NULL,
    "clientSeed" TEXT NOT NULL,
    "nonce" INTEGER NOT NULL,
    "resultHash" TEXT NOT NULL,
    "result" INTEGER NOT NULL,
    "openedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CaseOpening_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CaseOpening" ("caseId", "caseName", "casePrice", "id", "itemName", "itemRarity", "itemValue", "openedAt", "profit", "userId") SELECT "caseId", "caseName", "casePrice", "id", "itemName", "itemRarity", "itemValue", "openedAt", "profit", "userId" FROM "CaseOpening";
DROP TABLE "CaseOpening";
ALTER TABLE "new_CaseOpening" RENAME TO "CaseOpening";
CREATE INDEX "CaseOpening_userId_openedAt_idx" ON "CaseOpening"("userId", "openedAt");
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
    "level" INTEGER NOT NULL DEFAULT 1,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "streak" INTEGER NOT NULL DEFAULT 0,
    "lastLoginAt" DATETIME,
    "currentClientSeed" TEXT,
    "currentServerSeed" TEXT,
    "currentNonce" INTEGER NOT NULL DEFAULT 0,
    "aiModel" TEXT DEFAULT 'gpt-3.5-turbo',
    "aiQuota" INTEGER NOT NULL DEFAULT 10000,
    "aiUsage" INTEGER NOT NULL DEFAULT 0,
    "aiUsageResetAt" DATETIME,
    "aiTotalCost" REAL NOT NULL DEFAULT 0,
    "gpt5Access" BOOLEAN NOT NULL DEFAULT false,
    "betaAccess" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_User" ("aiModel", "aiQuota", "aiTotalCost", "aiUsage", "aiUsageResetAt", "balance", "betaAccess", "createdAt", "email", "gpt5Access", "id", "isAdmin", "isPremium", "password", "plan", "steamId", "twoFAEnabled", "twoFASecret", "updatedAt", "username") SELECT "aiModel", "aiQuota", "aiTotalCost", "aiUsage", "aiUsageResetAt", "balance", "betaAccess", "createdAt", "email", "gpt5Access", "id", "isAdmin", "isPremium", "password", "plan", "steamId", "twoFAEnabled", "twoFASecret", "updatedAt", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "User_steamId_key" ON "User"("steamId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE INDEX "InventoryItem_userId_sold_idx" ON "InventoryItem"("userId", "sold");

-- CreateIndex
CREATE INDEX "Battle_status_createdAt_idx" ON "Battle"("status", "createdAt");

-- CreateIndex
CREATE INDEX "BattleParticipant_battleId_position_idx" ON "BattleParticipant"("battleId", "position");

-- CreateIndex
CREATE INDEX "BattleResult_battleId_round_idx" ON "BattleResult"("battleId", "round");

-- CreateIndex
CREATE UNIQUE INDEX "Achievement_code_key" ON "Achievement"("code");

-- CreateIndex
CREATE INDEX "UserAchievement_userId_completed_idx" ON "UserAchievement"("userId", "completed");

-- CreateIndex
CREATE INDEX "DailyReward_userId_claimedAt_idx" ON "DailyReward"("userId", "claimedAt");
