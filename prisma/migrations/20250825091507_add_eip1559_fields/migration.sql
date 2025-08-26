/*
  Warnings:

  - You are about to drop the column `timestamp` on the `transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `transaction` DROP COLUMN `timestamp`,
    ADD COLUMN `maxFeePerGas` VARCHAR(191) NULL,
    ADD COLUMN `maxPriorityFeePerGas` VARCHAR(191) NULL,
    MODIFY `gasPrice` VARCHAR(191) NULL;
