/*
  Warnings:

  - You are about to drop the column `featured` on the `blogs` table. All the data in the column will be lost.
  - You are about to drop the column `published` on the `blogs` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `books` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `blogs` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `blogs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `blogs` DROP COLUMN `featured`,
    DROP COLUMN `published`,
    ADD COLUMN `IsFeatured` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `isPublished` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `slug` VARCHAR(191) NOT NULL,
    ADD COLUMN `summary` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `books` DROP COLUMN `content`;

-- AlterTable
ALTER TABLE `duas` ADD COLUMN `english` VARCHAR(191) NULL,
    ADD COLUMN `tags` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `book_contents` (
    `id` VARCHAR(191) NOT NULL,
    `bookId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL,
    `html` LONGTEXT NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `book_contents_bookId_order_key`(`bookId`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `blogs_slug_key` ON `blogs`(`slug`);

-- AddForeignKey
ALTER TABLE `book_contents` ADD CONSTRAINT `book_contents_bookId_fkey` FOREIGN KEY (`bookId`) REFERENCES `books`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
