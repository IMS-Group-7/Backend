-- CreateTable
CREATE TABLE `Mower` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `serialNumber` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Mower_serialNumber_key`(`serialNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Coordinate` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `mowerId` INTEGER NOT NULL,
    `x` INTEGER NOT NULL,
    `y` INTEGER NOT NULL,
    `is_boundary` BOOLEAN NOT NULL,
    `timestamp` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CollisionAvoidance` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `mowerId` INTEGER NOT NULL,
    `x` INTEGER NOT NULL,
    `y` INTEGER NOT NULL,
    `imagePath` VARCHAR(191) NOT NULL,
    `object` VARCHAR(191) NOT NULL,
    `timestamp` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Coordinate` ADD CONSTRAINT `Coordinate_mowerId_fkey` FOREIGN KEY (`mowerId`) REFERENCES `Mower`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CollisionAvoidance` ADD CONSTRAINT `CollisionAvoidance_mowerId_fkey` FOREIGN KEY (`mowerId`) REFERENCES `Mower`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
