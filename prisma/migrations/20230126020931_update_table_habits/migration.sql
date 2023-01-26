/*
  Warnings:

  - You are about to drop the column `isCompleted` on the `habits` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_habits" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "schedule" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_habits" ("createdAt", "id", "name", "schedule") SELECT "createdAt", "id", "name", "schedule" FROM "habits";
DROP TABLE "habits";
ALTER TABLE "new_habits" RENAME TO "habits";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
