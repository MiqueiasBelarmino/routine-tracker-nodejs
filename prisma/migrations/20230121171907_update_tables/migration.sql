/*
  Warnings:

  - You are about to drop the column `target_date` on the `habits` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_habits" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "schedule" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_completed" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_habits" ("created_at", "id", "is_completed", "name", "schedule") SELECT "created_at", "id", "is_completed", "name", "schedule" FROM "habits";
DROP TABLE "habits";
ALTER TABLE "new_habits" RENAME TO "habits";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
