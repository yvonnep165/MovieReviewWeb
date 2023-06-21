/*
  Warnings:

  - The primary key for the `Movie` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `cast` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `director` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `imdbID` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `imdbRating` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the `_watchList` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_watchedMovies` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `tmdbID` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tmdbRating` to the `Movie` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Review` DROP FOREIGN KEY `Review_movieId_fkey`;

-- DropForeignKey
ALTER TABLE `_watchList` DROP FOREIGN KEY `_watchList_A_fkey`;

-- DropForeignKey
ALTER TABLE `_watchList` DROP FOREIGN KEY `_watchList_B_fkey`;

-- DropForeignKey
ALTER TABLE `_watchedMovies` DROP FOREIGN KEY `_watchedMovies_A_fkey`;

-- DropForeignKey
ALTER TABLE `_watchedMovies` DROP FOREIGN KEY `_watchedMovies_B_fkey`;

-- AlterTable
ALTER TABLE `Movie` DROP PRIMARY KEY,
    DROP COLUMN `cast`,
    DROP COLUMN `director`,
    DROP COLUMN `id`,
    DROP COLUMN `imdbID`,
    DROP COLUMN `imdbRating`,
    ADD COLUMN `tmdbID` INTEGER NOT NULL,
    ADD COLUMN `tmdbRating` DOUBLE NOT NULL,
    MODIFY `rating` DOUBLE NOT NULL DEFAULT 0,
    ADD PRIMARY KEY (`tmdbID`);

-- DropTable
DROP TABLE `_watchList`;

-- DropTable
DROP TABLE `_watchedMovies`;

-- CreateTable
CREATE TABLE `_watchedBy` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_watchedBy_AB_unique`(`A`, `B`),
    INDEX `_watchedBy_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_watchListBy` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_watchListBy_AB_unique`(`A`, `B`),
    INDEX `_watchListBy_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_movieId_fkey` FOREIGN KEY (`movieId`) REFERENCES `Movie`(`tmdbID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_watchedBy` ADD CONSTRAINT `_watchedBy_A_fkey` FOREIGN KEY (`A`) REFERENCES `Movie`(`tmdbID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_watchedBy` ADD CONSTRAINT `_watchedBy_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_watchListBy` ADD CONSTRAINT `_watchListBy_A_fkey` FOREIGN KEY (`A`) REFERENCES `Movie`(`tmdbID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_watchListBy` ADD CONSTRAINT `_watchListBy_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
