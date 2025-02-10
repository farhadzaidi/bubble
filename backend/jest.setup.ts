import { createServer, Server } from "http";
import { database, createDatabaseConnection } from "./src/database";
import redis from "./src/redis";
import app from "./src/app";

export let server: Server;

beforeAll(async () => {
  server = createServer(app);
  await createDatabaseConnection();
});

afterAll(async () => {
  await database.end();
  await redis.quit();
  server.close();
});

// jest.spyOn(console, "log").mockImplementation(() => {});
