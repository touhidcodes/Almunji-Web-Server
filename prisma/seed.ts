import { seedAdmin } from "@/seed/seedAdmin";
import { seedPermissions } from "@/seed/seedPermissions";
import { seedSuperAdmin } from "@/seed/seedSuperAdmin";
import prisma from "@/utils/prisma";

export const seed = async () => {
  try {
    await seedSuperAdmin();
    await seedPermissions();
    await seedAdmin();
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

seed();