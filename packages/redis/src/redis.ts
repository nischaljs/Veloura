import Redis from "ioredis";

// Singleton Redis client instance
let redisClient: Redis | null = null;
let hasLoggedConnection = false;

/**
 * Creates and returns a Redis client instance.
 * Uses singleton pattern to ensure only one connection is maintained.
 * @returns {Redis} Redis client instance
 */
const redisClientGenerator = () => {
  if (redisClient) {
    return redisClient;
  }

  // Create new Redis connection
  redisClient = new Redis(process.env.REDIS_URL as string);

  // Handle Redis connection errors
  redisClient.on("error", (err) => {
    console.error("Redis connection error:", err);
  });

  // Log successful connection
  redisClient.on("connect", () => {
    if (!hasLoggedConnection) {
      console.log("Successfully connected to Redis!");
      hasLoggedConnection = true;
    }
  });

  return redisClient;
};

export default redisClientGenerator;
