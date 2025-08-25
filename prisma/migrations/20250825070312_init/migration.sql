-- CreateTable
CREATE TABLE `Transaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userKey` VARCHAR(191) NOT NULL,
    `from` VARCHAR(191) NOT NULL,
    `to` VARCHAR(191) NOT NULL,
    `amount` VARCHAR(191) NOT NULL,
    `txHash` VARCHAR(191) NOT NULL,
    `gasLimit` VARCHAR(191) NOT NULL,
    `gasPrice` VARCHAR(191) NOT NULL,
    `gasUsed` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
