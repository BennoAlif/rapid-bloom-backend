-- CreateTable
CREATE TABLE `projects` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `dbCliet` ENUM('PostgreSQL', 'MySQL') NOT NULL,
    `dbName` VARCHAR(191) NOT NULL,
    `dbHost` VARCHAR(191) NOT NULL,
    `dbPort` VARCHAR(191) NOT NULL,
    `dbUsername` VARCHAR(191) NOT NULL,
    `dbPassword` VARCHAR(191) NOT NULL,
    `sslCon` BOOLEAN NOT NULL DEFAULT false,
    `status` ENUM('RUNNING', 'STOPPED', 'PROCESSING') NOT NULL DEFAULT 'PROCESSING',
    `isDeployed` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
