import prisma from "@/utils/prisma";
import { Resource, Action } from "@/generated/prisma/enums";

export const seedPermissions = async () => {
  try {
    const resources = Object.values(Resource);
    const actions = Object.values(Action);

    // 1. Get existing permissions from DB
    const existingPermissions = await prisma.permission.findMany({
      select: {
        resource: true,
        action: true,
      },
    });

    // 2. Convert existing to Set for fast lookup
    const existingSet = new Set(
      existingPermissions.map((p) => `${p.resource}:${p.action}`)
    );

    // 3. Build missing permissions list
    const missingPermissions: { resource: Resource; action: Action }[] = [];

    for (const resource of resources) {
      for (const action of actions) {
        const key = `${resource}:${action}`;

        if (!existingSet.has(key)) {
          missingPermissions.push({ resource, action });
        }
      }
    }

    // Insert only missing ones
    if (missingPermissions.length > 0) {
      await prisma.permission.createMany({
        data: missingPermissions,
        skipDuplicates: true,
      });

      console.log(`Seeded ${missingPermissions.length} new permissions`);
    } else {
      console.log("All permissions already exist.");
    }
  } catch (err) {
    throw err;
  }
};
