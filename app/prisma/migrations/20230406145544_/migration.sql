/*
  Warnings:

  - You are about to drop the column `mowingSessionId` on the `Coordinate` table. All the data in the column will be lost.
  - You are about to drop the `MowingSession` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `sessionId` to the `Coordinate` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Coordinate` DROP FOREIGN KEY `Coordinate_mowingSessionId_fkey`;

-- DropForeignKey
ALTER TABLE `MowingSession` DROP FOREIGN KEY `MowingSession_mowerId_fkey`;

-- AlterTable
ALTER TABLE `Coordinate` DROP COLUMN `mowingSessionId`,
    ADD COLUMN `sessionId` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `MowingSession`;

-- CreateTable
CREATE TABLE `Session` (
    `id` VARCHAR(191) NOT NULL,
    `mowerId` VARCHAR(191) NOT NULL,
    `startTime` DATETIME(3) NOT NULL,
    `endTime` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Session` ADD CONSTRAINT `Session_mowerId_fkey` FOREIGN KEY (`mowerId`) REFERENCES `Mower`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Coordinate` ADD CONSTRAINT `Coordinate_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `Session`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
