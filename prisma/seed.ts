import { UserRole } from "@prisma/client";
import * as bcrypt from "bcrypt";
import prisma from "../src/app/utils/prisma";
import config from "../src/app/config/config";

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
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
};
