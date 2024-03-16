/*
  Warnings:

  - A unique constraint covering the columns `[host,user,database]` on the table `Cluster` will be added. If there are existing duplicate values, this will fail.
  - Made the column `login` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX `User_email_key` ON `user`;

-- AlterTable
ALTER TABLE `user` MODIFY `login` VARCHAR(191) NOT NULL,
    MODIFY `email` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Request_Register` (
    `id` VARCHAR(191) NOT NULL,
    `viewName` VARCHAR(191) NULL,
    `database` VARCHAR(191) NULL,
    `queryContent` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NULL,
    `dateCreate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dateUpdate` DATETIME(3) NOT NULL,
    `clusterId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Cluster_host_user_database_key` ON `Cluster`(`host`, `user`, `database`);

-- AddForeignKey
ALTER TABLE `Request_Register` ADD CONSTRAINT `Request_Register_clusterId_fkey` FOREIGN KEY (`clusterId`) REFERENCES `Cluster`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
