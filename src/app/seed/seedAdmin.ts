import * as bcrypt from "bcrypt";
import prisma from "@/utils/prisma";
import { UserRole } from "@/generated/prisma/enums";
import config from "@/config/config";

export const seedAdmin = async () => {
  try {
    const existingAdmin = await prisma.user.findFirst({
      where: {
        role: UserRole.ADMIN,
      },
    });

    if (existingAdmin) {
      console.log("Admin already exists.");
      return;
    }

    // Get SUPERADMIN (must exist)
    const superAdmin = await prisma.user.findFirst({
      where: { role: UserRole.SUPERADMIN },
    });

    if (!superAdmin) {
      throw new Error("Super admin must exist before creating admin");
    }

    const hashedPassword = await bcrypt.hash(
      `${config.admin.admin_password}`,
      12
    );

    const admin = await prisma.user.create({
      data: {
        email: config.admin.admin_email as string,
        password: hashedPassword,
        role: UserRole.ADMIN,
        username: config.admin.admin_username as string,
      },
    });

    // Get all permissions
    const permissions = await prisma.permission.findMany();

    // Assign all permissions to admin
    await prisma.userPermission.createMany({
      data: permissions.map((p) => ({
        userId: admin.id,
        permissionId: p.id,
        assignedBy: superAdmin.id,
      })),
      skipDuplicates: true,
    });

    console.log("Admin created with all permissions.");
  } catch (err) {
    throw err;
  }
};
