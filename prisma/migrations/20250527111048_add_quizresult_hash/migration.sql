/*
  Warnings:

  - A unique constraint covering the columns `[hash]` on the table `QuizResult` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "QuizResult" ADD COLUMN     "hash" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "QuizResult_hash_key" ON "QuizResult"("hash");
