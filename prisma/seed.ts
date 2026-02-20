// import { PrismaClient } from "@prisma/client";
// import { seedPermissions } from "../src/app/seed/seedPermissions";
// import { seedSuperAdmin } from "../src/app/seed/seedSuperAdmin";

// const prisma = new PrismaClient();

// export async function seed() {
//   await seedSuperAdmin();
//   await seedPermissions();
// }

// seed()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });

import { seedPermissions } from "../src/app/seed/seedPermissions";
import { seedSuperAdmin } from "../src/app/seed/seedSuperAdmin";
import prisma from "../src/app/utils/prisma";

export const seed = async () => {
  try {
    await seedSuperAdmin();
    await seedPermissions();
  } catch (err) {
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

// Allow CLI execution
if (require.main === module) {
  seed();
}
