import { Redis } from "ioredis";
import process from "node:process";

let redisInstance;

const connectRedis = async () => {
  try {
    redisInstance = new Redis({
      host: process.env.REDIS_HOST || "127.0.0.1",
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD,
      db: process.env.REDIS_DB || 0,
    });

    // perform some task to check connection
    await redisInstance.set("test", true);
    await redisInstance.get("test");
    await redisInstance.del("test");

    console.log(
      `\n🟥 Redis connected! ${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
    );
  } catch (error) {
    console.log("Redis connection error", error);
    process.exit(1);
  }
};

export { redisInstance, connectRedis };
