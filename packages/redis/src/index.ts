import dotenv from "dotenv";
import path from "path";
import redisClientGenerator from "./redis";
import { OTPManager, DEFAULT_OTP_CONFIG } from "./otp";
import { EmailManager, EmailConfig } from "./email";

// Load environment variables
dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

// Export Redis client
export const getRedisClient = redisClientGenerator;

// Email configuration
const emailConfig: EmailConfig = {
  host: process.env.SMTP_HOST as string,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER as string,
    pass: process.env.SMTP_PASSWORD as string,
  },
  from: `"Veloura" <${process.env.SMTP_USER}>`,
};

// Create and export managers
export const otpManager = new OTPManager();
export const emailManager = new EmailManager(emailConfig);

// Export types and classes
export { OTPManager, EmailManager, DEFAULT_OTP_CONFIG };
