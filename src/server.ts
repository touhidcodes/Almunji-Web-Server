import { Server } from "http";
import { seed } from "../prisma/seed";
import app from "./app";
import config from "./app/config/config";

async function main() {
  if (config.env === "development") {
    await seed();
  }

  const server: Server = app.listen(config.port, () => {
    console.log("Sever is running on port ", config.port);
  });
}

main();
