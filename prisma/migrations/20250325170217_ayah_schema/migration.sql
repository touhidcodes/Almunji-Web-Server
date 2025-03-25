/*
  Warnings:

  - You are about to drop the column `pronanciation` on the `ayahs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `ayahs` DROP COLUMN `pronanciation`,
    ADD COLUMN `pronunciation` VARCHAR(191) NULL;
