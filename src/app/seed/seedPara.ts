import prisma from "@/utils/prisma";
import { paraData } from "../../data/paraData";

export const seedPara = async () => {
  try {
    for (const para of paraData) {
      const exists = await prisma.para.findUnique({
        where: {
          number: para.number,
        },
      });

      if (exists) {
        console.log(`Para ${para.number} already exists. Skipping...`);
        continue;
      }

      await prisma.para.create({
        data: para,
      });

      console.log(`Para ${para.number} inserted.`);
    }

    console.log("Para seeding completed.");
  } catch (err) {
    throw err;
  }
};
