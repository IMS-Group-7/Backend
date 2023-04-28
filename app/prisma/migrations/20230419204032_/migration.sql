/*
  Warnings:

  - You are about to drop the column `mowerId` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the `Mower` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Session` DROP FOREIGN KEY `Session_mowerId_fkey`;

-- AlterTable
ALTER TABLE `Session` DROP COLUMN `mowerId`;

-- DropTable
DROP TABLE `Mower`;
