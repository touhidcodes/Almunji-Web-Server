/*
  Warnings:

  - You are about to alter the column `tags` on the `duas` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.

*/
-- DropForeignKey
ALTER TABLE `bookmarks` DROP FOREIGN KEY `bookmarks_userId_fkey`;

-- DropForeignKey
ALTER TABLE `user_permissions` DROP FOREIGN KEY `user_permissions_userId_fkey`;

-- DropForeignKey
ALTER TABLE `user_profiles` DROP FOREIGN KEY `user_profiles_userId_fkey`;

-- AlterTable
ALTER TABLE `duas` MODIFY `tags` JSON NULL;

-- AddForeignKey
ALTER TABLE `user_profiles` ADD CONSTRAINT `user_profiles_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_permissions` ADD CONSTRAINT `user_permissions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bookmarks` ADD CONSTRAINT `bookmarks_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
