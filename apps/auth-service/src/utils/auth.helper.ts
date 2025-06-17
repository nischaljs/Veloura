import { ValidationError } from "@veloura/error-handler";
import { getRedisClient, sendEmail } from "@veloura/redis";
import { userregisterSchema, vendorregisterSchema } from "@veloura/zod-schemas";
import { NextFunction } from "express";
import crypto from "crypto";

export const validateRegistrationData = (
  data: any,
  userType: "USER" | "VENDOR",
): any => {
  if (userType === "USER") {
    const result = userregisterSchema.safeParse(data);
    if (result.success) {
      return result.data;
    } else {
      throw new ValidationError(result?.error?.message);
    }
  } else if (userType === "VENDOR") {
    const result = vendorregisterSchema.safeParse(data);
    if (result.success) {
      return result.data;
    } else {
      throw new ValidationError(result?.error?.message);
    }
  } else {
    throw new ValidationError("Invalid user type");
  }
};

export const checkOTPrestrictions = async (
  email: string,
  next: NextFunction,
) => {
  const redis = getRedisClient();
  if (await redis.get(`otp_lock:${email}`)) {
    return next(
      new ValidationError(
        "Your account is locked due to too many failed login attempts!! Try again after 30 minutes",
      ),
    );
  }
  if (await redis.get(`otp_spam_lock:${email}`)) {
    return next(
      new ValidationError(
        "Too many OTP requests! Please wait 1 hour before requesting",
      ),
    );
  }
  if (await redis.get(`otp_cooldown:${email}`)) {
    return next(
      new ValidationError("Please wait 60 seconds before requesting OTP again"),
    );
  }
};

export const trackOtpRequests = async (email: string, next: NextFunction) => {
  const redis = getRedisClient();
  const otpRequestKey = `otp_request_count:${email}`;
  let requests = parseInt((await redis.get(otpRequestKey)) ?? "0");

  if (requests >= 2) {
    await redis.set(`otp_spam_lock:${email}`, "locked", "EX", 3600);
    return next(
      new ValidationError(
        "Too many OTP requests! Please wait 1 hour before requesting",
      ),
    );
  }
  await redis.set(otpRequestKey, requests + 1, "EX", 3600);
};

export const sendOTP = async (
  name: string,
  email: string,
  template: string,
) => {
  const redis = getRedisClient();
  const otp = crypto.randomInt(1000, 9999).toString();
  await sendEmail(email, "Verify Your Email", template, { name, otp });
  await redis.set(`otp:${email}`, otp, "EX", 300);
  await redis.set(`otp_cooldown:${email}`, "true", "EX", 60);
};
