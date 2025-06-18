import  getRedisClient  from "./redis";
import { ValidationError } from "@veloura/response-handler";

/**
 * Configuration options for OTP management
 */
export interface OTPConfig {
  expiry: number;      // OTP validity duration in seconds
  cooldown: number;    // Cooldown period between OTP requests in seconds
  maxAttempts: number; // Maximum failed attempts before lockout
  lockDuration: number; // Account lockout duration in seconds
}

// Default OTP configuration
export const DEFAULT_OTP_CONFIG: OTPConfig = {
  expiry: 300,      // 5 minutes
  cooldown: 60,     // 1 minute
  maxAttempts: 3,   // 3 attempts
  lockDuration: 1800, // 30 minutes
};

/**
 * Manages OTP generation, verification, and rate limiting
 */
export class OTPManager {
  private redis = getRedisClient();
  private config: OTPConfig;

  constructor(config: Partial<OTPConfig> = {}) {
    this.config = { ...DEFAULT_OTP_CONFIG, ...config };
  }

  // Redis key generators
  private getKey(key: string): string { return `otp:${key}`; }
  private getLockKey(key: string): string { return `otp_lock:${key}`; }
  private getCooldownKey(key: string): string { return `otp_cooldown:${key}`; }
  private getAttemptsKey(key: string): string { return `otp_attempts:${key}`; }

  /**
   * Generates a new OTP for the given key
   * @param key - Unique identifier (e.g., user ID or email)
   * @returns Generated OTP
   */
  async generateOTP(key: string): Promise<string> {
    await this.checkRestrictions(key);
    
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    await this.redis.setex(this.getKey(key), this.config.expiry, otp);
    await this.redis.setex(this.getCooldownKey(key), this.config.cooldown, "1");
    
    return otp;
  }

  /**
   * Verifies an OTP for the given key
   * @param key - Unique identifier
   * @param otp - OTP to verify
   * @returns true if OTP is valid
   */
  async verifyOTP(key: string, otp: string): Promise<boolean> {
    const storedOTP = await this.redis.get(this.getKey(key));
    
    if (!storedOTP) {
      throw new ValidationError("OTP has expired");
    }

    if (storedOTP !== otp) {
      await this.incrementAttempts(key);
      return false;
    }

    await this.cleanup(key);
    return true;
  }

  /**
   * Checks if OTP generation is allowed for the key
   */
  private async checkRestrictions(key: string): Promise<void> {
    const [isLocked, isInCooldown] = await Promise.all([
      this.redis.get(this.getLockKey(key)),
      this.redis.get(this.getCooldownKey(key))
    ]);

    if (isLocked) {
      throw new ValidationError("Account is locked due to too many failed attempts");
    }

    if (isInCooldown) {
      throw new ValidationError("Please wait before requesting a new OTP");
    }
  }

  /**
   * Increments failed attempt counter and locks account if threshold is reached
   */
  private async incrementAttempts(key: string): Promise<void> {
    const attempts = await this.redis.incr(this.getAttemptsKey(key));
    
    if (attempts >= this.config.maxAttempts) {
      await this.redis.setex(this.getLockKey(key), this.config.lockDuration, "1");
      throw new ValidationError("Too many failed attempts. Account is locked");
    }
  }

  /**
   * Cleans up all OTP-related keys for the given key
   */
  private async cleanup(key: string): Promise<void> {
    await Promise.all([
      this.redis.del(this.getKey(key)),
      this.redis.del(this.getAttemptsKey(key)),
      this.redis.del(this.getCooldownKey(key))
    ]);
  }
} 