/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `blogs` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `books` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `books` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `books` ADD COLUMN `slug` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `blogs_title_key` ON `blogs`(`title`);

-- CreateIndex
CREATE UNIQUE INDEX `books_slug_key` ON `books`(`slug`);
