-- CreateTable
CREATE TABLE "habits" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "target_date" DATETIME NOT NULL,
    "recurring" TEXT NOT NULL,
    "schedule" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_completed" BOOLEAN NOT NULL DEFAULT false
);