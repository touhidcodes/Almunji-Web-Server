import { Server } from "http";
import app from "./app";
import config from "./app/config/config";
import { seed } from "./app/seed/seed";

async function main() {
  await seed();

  const server: Server = app.listen(config.port, () => {
    console.log("Sever is running on port ", config.port);
  });
}

main();
