import Redis from "ioredis";

let redisClient: Redis | null = null;
let hasLoggedConnection = false;

const redisClientGenerator = () => {
  if (redisClient) {
    return redisClient;
  }

  redisClient = new Redis(process.env.REDIS_URL as string);

  redisClient.on("error", (err) => {
    console.error("Redis error", err);
  });

  redisClient.on("connect", () => {
    if (!hasLoggedConnection) {
      console.log("Successfully connected to Redis!");
      hasLoggedConnection = true;
    }
  });

  return redisClient;
};

export default redisClientGenerator;
