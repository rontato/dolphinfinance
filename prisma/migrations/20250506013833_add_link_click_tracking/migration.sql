-- CreateTable
CREATE TABLE "LinkClick" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER,
    "quizResultId" INTEGER,
    "productName" TEXT NOT NULL,
    "productLink" TEXT NOT NULL,
    "clickedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LinkClick_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "LinkClick_quizResultId_fkey" FOREIGN KEY ("quizResultId") REFERENCES "QuizResult" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
