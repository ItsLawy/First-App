-- CreateTable
CREATE TABLE "_UserTocompany" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_UserTocompany_A_fkey" FOREIGN KEY ("A") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_UserTocompany_B_fkey" FOREIGN KEY ("B") REFERENCES "company" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserTocompany_AB_unique" ON "_UserTocompany"("A", "B");

-- CreateIndex
CREATE INDEX "_UserTocompany_B_index" ON "_UserTocompany"("B");
