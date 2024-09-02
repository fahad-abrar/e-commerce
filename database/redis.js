import Redis from "ioredis";
import ErrorHandler from "../errorhandler/errHandler.js";

const redis = () => {
  try {
    const url = process.env.REDIS_URL;
    if (!url) {
      throw new Error("redis url is not set");
    }
    const redisClient = new Redis(url);

    redisClient.on("error", (err) => {
      console.error("Redis error:", err);
    });

    return redisClient;
  } catch (error) {
    console.error("Redis connection error:", error.message);
    throw new ErrorHandler(error.message, 500);
  }
};

export default redis;
