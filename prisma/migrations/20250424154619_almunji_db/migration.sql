/*
  Warnings:

  - You are about to drop the column `text` on the `tafsirs` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `tafsirs` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ayahId]` on the table `tafsirs` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `tafsirs` DROP COLUMN `text`,
    DROP COLUMN `title`,
    ADD COLUMN `detailBn` VARCHAR(191) NULL,
    ADD COLUMN `detailEn` VARCHAR(191) NULL,
    ADD COLUMN `heading` VARCHAR(191) NULL,
    ADD COLUMN `summaryBn` VARCHAR(191) NULL,
    ADD COLUMN `summaryEn` VARCHAR(191) NULL,
    ADD COLUMN `tags` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `tafsirs_ayahId_key` ON `tafsirs`(`ayahId`);
