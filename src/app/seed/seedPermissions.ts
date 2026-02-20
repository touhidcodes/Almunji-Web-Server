import { Action, Resource } from "@prisma/client";
import prisma from "../utils/prisma";

export async function seedPermissions() {
  try {
    const resources = Object.values(Resource);
    const actions = Object.values(Action);

    const permissions = [];

    for (const resource of resources) {
      for (const action of actions) {
        permissions.push({
          resource,
          action,
        });
      }
    }

    for (const perm of permissions) {
      await prisma.permission.upsert({
        where: {
          resource_action: {
            resource: perm.resource,
            action: perm.action,
          },
        },
        update: {},
        create: {
          resource: perm.resource,
          action: perm.action,
        },
      });
    }
    console.log(`${permissions.length} Permissions seeded successfully!`);
  } catch (err) {
    throw err;
  }
}
