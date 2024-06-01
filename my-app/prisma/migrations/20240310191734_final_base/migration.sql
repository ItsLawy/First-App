/*
  Warnings:

  - Added the required column `Address` to the `company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdAt` to the `company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Address` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_company" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "Address" TEXT NOT NULL
);
INSERT INTO "new_company" ("id", "name") SELECT "id", "name" FROM "company";
DROP TABLE "company";
ALTER TABLE "new_company" RENAME TO "company";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "Address" TEXT NOT NULL,
    "UserBackground" TEXT NOT NULL
);
INSERT INTO "new_User" ("UserBackground", "createdAt", "id", "name", "phone") SELECT "UserBackground", "createdAt", "id", "name", "phone" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
