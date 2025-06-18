import { getRedisClient } from "@veloura/redis";
import { ValidationError } from "@veloura/response-handler";
import { userregisterSchema, vendorregisterSchema } from "@veloura/zod-schemas";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const OTP_EXPIRY = 300; // 5 minutes
const TOKEN_EXPIRY = 86400; // 24 hours
const OTP_COOLDOWN = 60; // 1 minute
const OTP_LOCK_DURATION = 1800; // 30 minutes
const OTP_SPAM_LOCK_DURATION = 3600; // 1 hour
const MAX_OTP_REQUESTS = 2;

// Validate registration data based on user type
export const validateRegistrationData = (
  data: any,
  userType: "USER" | "VENDOR",
): any => {
  const schema = userType === "USER" ? userregisterSchema : vendorregisterSchema;
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new ValidationError(result.error.message);
  }
  return result.data;
};

export const checkOTPrestrictions = async (email: string): Promise<void> => {
  const redis = getRedisClient();
  const locks = await Promise.all([
    redis.get(`otp_lock:${email}`),
    redis.get(`otp_spam_lock:${email}`),
    redis.get(`otp_cooldown:${email}`)
  ]);

  if (locks[0]) {
    throw new ValidationError("Your account is locked due to too many failed login attempts! Try again after 30 minutes");
  }
  if (locks[1]) {
    throw new ValidationError("Too many OTP requests! Please wait 1 hour before requesting");
  }
  if (locks[2]) {
    throw new ValidationError("Please wait 60 seconds before requesting OTP again");
  }
};

export const trackOtpRequests = async (email: string): Promise<void> => {
  const redis = getRedisClient();
  const otpRequestKey = `otp_request_count:${email}`;
  const requests = parseInt((await redis.get(otpRequestKey)) ?? "0");

  if (requests >= MAX_OTP_REQUESTS) {
    await redis.setex(`otp_spam_lock:${email}`, OTP_SPAM_LOCK_DURATION, "locked");
    throw new ValidationError("Too many OTP requests! Please wait 1 hour before requesting");
  }
  await redis.setex(otpRequestKey, OTP_SPAM_LOCK_DURATION, (requests + 1).toString());
};

export const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

export const generateJWT = (user: any) => {
  return jwt.sign(
    { 
      id: user.id,
      email: user.email,
      role: user.role 
    },
    process.env.JWT_SECRET as string,
    { expiresIn: '7d' }
  );
};



// Hash password with bcrypt
export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const verifyEmail = async (token: string, otp?: string) => {
  const redis = getRedisClient();
  const userId = await redis.get(`verification:${token}`);
  
  if (!userId) {
    throw new ValidationError("Invalid or expired verification token");
  }

  if (otp) {
    const storedOtp = await redis.get(`otp:${userId}`);
    if (!storedOtp || storedOtp !== otp) {
      throw new ValidationError("Invalid OTP");
    }
  }

  await Promise.all([
    redis.del(`verification:${token}`),
    otp ? redis.del(`otp:${userId}`) : Promise.resolve()
  ]);

  return userId;
};

export const generateAndStoreOTP = async (userId: string): Promise<string> => {
  const redis = getRedisClient();
  const otp = crypto.randomInt(1000, 9999).toString();
  await redis.setex(`otp:${userId}`, OTP_EXPIRY, otp);
  return otp;
};
