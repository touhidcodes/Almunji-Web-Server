-- AlterTable
ALTER TABLE `users` MODIFY `role` ENUM('SUPERADMIN', 'ADMIN', 'MODERATOR', 'USER') NOT NULL;

-- CreateTable
CREATE TABLE `surahs` (
    `id` VARCHAR(191) NOT NULL,
    `chapter` INTEGER NOT NULL,
    `totalAyah` INTEGER NOT NULL,
    `arabicName` VARCHAR(191) NOT NULL,
    `englishName` VARCHAR(191) NOT NULL,
    `banglaName` VARCHAR(191) NULL,
    `history` VARCHAR(191) NULL,
    `revelation` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `surahs_chapter_key`(`chapter`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ayahs` (
    `id` VARCHAR(191) NOT NULL,
    `surahId` VARCHAR(191) NOT NULL,
    `ayahNumber` INTEGER NOT NULL,
    `arabicText` VARCHAR(191) NOT NULL,
    `banglaText` VARCHAR(191) NULL,
    `englishText` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ayahs_surahId_ayahNumber_key`(`surahId`, `ayahNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tafsirs` (
    `id` VARCHAR(191) NOT NULL,
    `ayahId` VARCHAR(191) NOT NULL,
    `heading` VARCHAR(191) NULL,
    `text` VARCHAR(191) NOT NULL,
    `scholar` VARCHAR(191) NULL,
    `reference` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ayahs` ADD CONSTRAINT `ayahs_surahId_fkey` FOREIGN KEY (`surahId`) REFERENCES `surahs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tafsirs` ADD CONSTRAINT `tafsirs_ayahId_fkey` FOREIGN KEY (`ayahId`) REFERENCES `ayahs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
