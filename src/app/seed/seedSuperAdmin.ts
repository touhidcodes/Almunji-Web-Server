import { UserRole } from "@prisma/client";
import * as bcrypt from "bcrypt";
import config from "../config/config";
import prisma from "../utils/prisma";

export const seedSuperAdmin = async () => {
  try {
    const isExistSuperAdmin = await prisma.user.findFirst({
      where: {
        role: UserRole.SUPERADMIN,
      },
    });

    if (isExistSuperAdmin) {
      console.log("Super admin is online!");
      return;
    }

    const hashedPassword = await bcrypt.hash(
      `${config.superAdmin.super_admin_password}`,
      12
    );

    await prisma.user.create({
      data: {
        email: config.superAdmin.super_admin_email,
        password: hashedPassword,
        role: UserRole.SUPERADMIN,
        username: config.superAdmin.super_admin_username as string,
      },
    });

    console.log("Super admin seeded successfully!");
  } catch (err) {
    throw err;
  }
};
