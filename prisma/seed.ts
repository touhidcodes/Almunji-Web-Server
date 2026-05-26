import { seedAdmin } from "@/seed/seedAdmin";
import { seedPara } from "@/seed/seedPara";
import { seedPermissions } from "@/seed/seedPermissions";
import { seedSuperAdmin } from "@/seed/seedSuperAdmin";
import { seedSurah } from "@/seed/seedSurah";
import prisma from "@/utils/prisma";

export const seed = async () => {
  try {
    await seedSuperAdmin();
    await seedPermissions();
    await seedAdmin();
    await seedSurah ();
    await seedPara();
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

seed();