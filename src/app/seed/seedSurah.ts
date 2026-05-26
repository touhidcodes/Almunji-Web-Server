import prisma from "@/utils/prisma";
import { surahData } from "../../data/surahsData";

export const seedSurah = async () => {
  try {
    for (const surah of surahData) {
      const exists = await prisma.surah.findUnique({
        where: {
          chapter: surah.chapter,
        },
      });

      if (exists) {
        console.log(`Surah ${surah.chapter} already exists. Skipping...`);
        continue;
      }

      await prisma.surah.create({
        data: surah,
      });

      console.log(`Surah ${surah.chapter} inserted.`);
    }

    console.log("Surah seeding completed.");
  } catch (err) {
    throw err;
  }
};
