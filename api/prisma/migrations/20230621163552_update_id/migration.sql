/*
  Warnings:

  - A unique constraint covering the columns `[tmdbID]` on the table `Movie` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Movie_tmdbID_key` ON `Movie`(`tmdbID`);
