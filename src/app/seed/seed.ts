import { seedPermissions } from "./seedPermissions";
import { seedSuperAdmin } from "./seedSuperAdmin";

let hasSeeded = false;

export async function seed() {
  if (process.env.NODE_ENV !== "development") return;
  if (hasSeeded) return;

  await seedSuperAdmin();
  await seedPermissions();
  hasSeeded = true;
}
