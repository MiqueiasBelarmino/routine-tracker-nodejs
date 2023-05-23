/*
  Warnings:

  - You are about to alter the column `expires_in` on the `refresh_token` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_refresh_token" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "expires_in" BIGINT NOT NULL,
    "user_id" TEXT NOT NULL,
    CONSTRAINT "refresh_token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_refresh_token" ("expires_in", "id", "user_id") SELECT "expires_in", "id", "user_id" FROM "refresh_token";
DROP TABLE "refresh_token";
ALTER TABLE "new_refresh_token" RENAME TO "refresh_token";
CREATE UNIQUE INDEX "refresh_token_user_id_key" ON "refresh_token"("user_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
