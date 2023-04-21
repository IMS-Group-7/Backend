/*
  Warnings:

  - You are about to drop the column `isBoundary` on the `Coordinate` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[coordinateId]` on the table `Obstacle` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `type` to the `Coordinate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Coordinate` DROP COLUMN `isBoundary`,
    ADD COLUMN `type` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Session` MODIFY `endTime` DATETIME(3) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Obstacle_coordinateId_key` ON `Obstacle`(`coordinateId`);
