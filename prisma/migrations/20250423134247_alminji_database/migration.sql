-- AlterTable
ALTER TABLE `blogs` MODIFY `content` LONGTEXT NOT NULL;

-- AlterTable
ALTER TABLE `tafsirs` ADD COLUMN `isDeleted` BOOLEAN NOT NULL DEFAULT false;
