import { Server } from "http";
import app from "./app";
import config from "./app/config/config";
import { seedTestCredentials } from "./app/utils/seedTestCredentials";
import { seedSuperAdmin } from "../prisma/seed";

async function main() {
  seedSuperAdmin();
  seedTestCredentials();
  const server: Server = app.listen(config.port, () => {
    console.log("Sever is running on port ", config.port);
  });
}

main();