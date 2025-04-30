/*
  Warnings:

  - You are about to drop the column `html` on the `book_contents` table. All the data in the column will be lost.
  - Added the required column `text` to the `book_contents` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `book_contents` DROP COLUMN `html`,
    ADD COLUMN `text` LONGTEXT NOT NULL;
