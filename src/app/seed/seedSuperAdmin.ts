import * as bcrypt from "bcrypt";
import { UserRole } from "@/generated/prisma/enums";
import config from "@/config/config";
import prisma from "@/utils/prisma";
import logger from "@/utils/logger";

export const seedSuperAdmin = async () => {
  try {
    const isExistSuperAdmin = await prisma.user.findFirst({
      where: {
        role: UserRole.SUPERADMIN,
      },
    });

    if (isExistSuperAdmin) {
      console.log("Super admin is already seeded.");
      return;
    }

    const hashedPassword = await bcrypt.hash(
      `${config.superAdmin.super_admin_password}`,
      12
    );

    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: config.superAdmin.super_admin_email,
          password: hashedPassword,
          role: UserRole.SUPERADMIN,
          username: config.superAdmin.super_admin_username as string,
        },
      });

      await tx.userProfile.create({
        data: { userId: user.id },
      });
    });

    console.log("Super admin seeded successfully!");
  } catch (err) {
    logger.error("Superadmin seeding failed:", err);
  }
};
