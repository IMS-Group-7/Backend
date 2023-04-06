/*
  Warnings:

  - The primary key for the `Coordinate` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `is_boundary` on the `Coordinate` table. All the data in the column will be lost.
  - You are about to drop the column `mowerId` on the `Coordinate` table. All the data in the column will be lost.
  - You are about to alter the column `timestamp` on the `Coordinate` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.
  - The primary key for the `Mower` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `serialNumber` on the `Mower` table. All the data in the column will be lost.
  - You are about to drop the `CollisionAvoidance` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[serial]` on the table `Mower` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `mowingSessionId` to the `Coordinate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdAt` to the `Mower` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serial` to the `Mower` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Mower` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Mower` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `CollisionAvoidance` DROP FOREIGN KEY `CollisionAvoidance_mowerId_fkey`;

-- DropForeignKey
ALTER TABLE `Coordinate` DROP FOREIGN KEY `Coordinate_mowerId_fkey`;

-- DropIndex
DROP INDEX `Mower_serialNumber_key` ON `Mower`;

-- AlterTable
ALTER TABLE `Coordinate` DROP PRIMARY KEY,
    DROP COLUMN `is_boundary`,
    DROP COLUMN `mowerId`,
    ADD COLUMN `isBoundary` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `mowingSessionId` VARCHAR(191) NOT NULL,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `timestamp` DATETIME(3) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Mower` DROP PRIMARY KEY,
    DROP COLUMN `serialNumber`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL,
    ADD COLUMN `serial` VARCHAR(191) NOT NULL,
    ADD COLUMN `status` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- DropTable
DROP TABLE `CollisionAvoidance`;

-- CreateTable
CREATE TABLE `MowingSession` (
    `id` VARCHAR(191) NOT NULL,
    `mowerId` VARCHAR(191) NOT NULL,
    `startTime` DATETIME(3) NOT NULL,
    `endTime` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Obstacle` (
    `id` VARCHAR(191) NOT NULL,
    `coordinateId` VARCHAR(191) NOT NULL,
    `imagePath` VARCHAR(191) NOT NULL,
    `object` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Mower_serial_key` ON `Mower`(`serial`);

-- AddForeignKey
ALTER TABLE `MowingSession` ADD CONSTRAINT `MowingSession_mowerId_fkey` FOREIGN KEY (`mowerId`) REFERENCES `Mower`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Coordinate` ADD CONSTRAINT `Coordinate_mowingSessionId_fkey` FOREIGN KEY (`mowingSessionId`) REFERENCES `MowingSession`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Obstacle` ADD CONSTRAINT `Obstacle_coordinateId_fkey` FOREIGN KEY (`coordinateId`) REFERENCES `Coordinate`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
