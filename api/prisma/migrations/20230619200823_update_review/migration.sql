/*
  Warnings:

  - You are about to drop the `_userReviews` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_userReviews` DROP FOREIGN KEY `_userReviews_A_fkey`;

-- DropForeignKey
ALTER TABLE `_userReviews` DROP FOREIGN KEY `_userReviews_B_fkey`;

-- AlterTable
ALTER TABLE `Movie` MODIFY `cast` TEXT NULL,
    MODIFY `plot` TEXT NULL;

-- AlterTable
ALTER TABLE `Review` ADD COLUMN `userId` INTEGER NOT NULL,
    MODIFY `comment` TEXT NULL;

-- DropTable
DROP TABLE `_userReviews`;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
