/*
  Warnings:

  - You are about to drop the column `recurring` on the `habits` table. All the data in the column will be lost.
  - Added the required column `schedule` to the `habits` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priority` to the `tasks` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_habits" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "target_date" DATETIME,
    "schedule" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_completed" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_habits" ("created_at", "id", "is_completed", "name", "target_date") SELECT "created_at", "id", "is_completed", "name", "target_date" FROM "habits";
DROP TABLE "habits";
ALTER TABLE "new_habits" RENAME TO "habits";
CREATE TABLE "new_tasks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "target_date" DATETIME NOT NULL,
    "priority" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_completed" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_tasks" ("created_at", "id", "is_completed", "name", "target_date") SELECT "created_at", "id", "is_completed", "name", "target_date" FROM "tasks";
DROP TABLE "tasks";
ALTER TABLE "new_tasks" RENAME TO "tasks";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
