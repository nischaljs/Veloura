import dotenv from "dotenv";
import path from "path"; // Import the 'path' module
import redisClientGenerator from "./redis";

dotenv.config({
  path: path.resolve(__dirname, "../.env"), // This is the most reliable way
});



export const getRedisClient = () => redisClientGenerator();

export { default as sendEmail } from "./nodemailer";
