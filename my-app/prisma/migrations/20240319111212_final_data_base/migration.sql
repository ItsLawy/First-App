/*
  Warnings:

  - You are about to drop the `_UserTocompany` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `CompanyBackground` to the `company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `CompanyID` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `StoreName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "_UserTocompany_B_index";

-- DropIndex
DROP INDEX "_UserTocompany_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_UserTocompany";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_company" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "Address" TEXT NOT NULL,
    "CompanyBackground" TEXT NOT NULL
);
INSERT INTO "new_company" ("Address", "createdAt", "id", "name", "phone") SELECT "Address", "createdAt", "id", "name", "phone" FROM "company";
DROP TABLE "company";
ALTER TABLE "new_company" RENAME TO "company";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "Address" TEXT NOT NULL,
    "CompanyID" TEXT NOT NULL,
    "UserBackground" TEXT NOT NULL,
    "StoreName" TEXT NOT NULL
);
INSERT INTO "new_User" ("Address", "UserBackground", "createdAt", "id", "name", "phone") SELECT "Address", "UserBackground", "createdAt", "id", "name", "phone" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
