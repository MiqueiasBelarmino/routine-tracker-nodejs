/*
  Warnings:

  - You are about to drop the column `created_at` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the column `is_completed` on the `tasks` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_tasks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "target_date" DATETIME NOT NULL,
    "priority" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_tasks" ("id", "name", "priority", "target_date") SELECT "id", "name", "priority", "target_date" FROM "tasks";
DROP TABLE "tasks";
ALTER TABLE "new_tasks" RENAME TO "tasks";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
