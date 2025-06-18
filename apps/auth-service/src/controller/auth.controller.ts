import { prisma } from "@veloura/db";
import { AppResponse, AuthError } from "@veloura/response-handler";
import { loginSchema, loginType, userRegisterType, vendorRegisterType, userregisterSchema, vendorregisterSchema } from "@veloura/zod-schemas";
import { NextFunction, Request, Response } from "express";
import { otpManager, emailManager } from "@veloura/redis";
import jwt from "jsonwebtoken";
import { hashPassword } from "../utils/auth.helper";

// Generate JWT token for authenticated users
const generateJWT = (user: any) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: '7d' }
  );
};

// Handle user login with email and password
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const requestBody: loginType = req.body;
    loginSchema.parse(requestBody);

    // Find user and check credentials
    const dbUser = await prisma.user.findUnique({
      where: { email: requestBody.email },
      include: { profile: true, vendorProfile: true },
    });

    if (!dbUser) throw new AuthError("Invalid credentials");
    if (!dbUser.isVerified) throw new AuthError("Please verify your email before logging in");

    const { passwordHash, ...userData } = dbUser;
    const token = generateJWT(dbUser);

    return AppResponse(res, { user: userData, token }, "Login Successful", 200);
  } catch (error) {
    next(error);
  }
};

// Verify user email using token or OTP
export const verifyUserEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { token, otp } = req.body;
    if (!token) throw new AuthError("Verification token is required");

    // Verify OTP if provided, otherwise verify token
    const isValid = otp ? await otpManager.verifyOTP(token, otp) : true;
    if (!isValid) throw new AuthError("Invalid verification code");

    // Update user verification status
    await prisma.user.update({
      where: { id: parseInt(token) },
      data: { isVerified: true }
    });

    return AppResponse(res, null, "Email verified successfully", 200);
  } catch (error) {
    next(error);
  }
};

// Register new customer with profile and addresses
export const customerRegister = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const requestBody: userRegisterType = req.body;
    userregisterSchema.parse(requestBody);

    // Check for existing user
    const existingUser = await prisma.user.findUnique({
      where: { email: requestBody.email },
    });
    if (existingUser) throw new AuthError("User with this email already exists");

    // Create new user with profile and addresses
    const newUser = await prisma.user.create({
      data: {
        email: requestBody.email,
        passwordHash: Buffer.from(await hashPassword(requestBody.password)),
        role: "CUSTOMER",
        isVerified: false,
        profile: {
          create: {
            firstName: requestBody.firstName,
            lastName: requestBody.lastName,
            phone: requestBody.phone,
            avatarUrl: requestBody.avatarUrl,
          },
        },
        addresses: {
          create: requestBody.addresses,
        },
      },
      include: {
        profile: true,
        addresses: true,
      },
    });

    // Generate OTP and send verification email
    const otp = await otpManager.generateOTP(newUser.id.toString());
    await emailManager.sendVerificationEmail(
      requestBody.email,
      `${process.env.FRONTEND_URL}/verify-email?token=${newUser.id}`,
      otp
    );

    const { passwordHash, ...userData } = newUser;
    const token = generateJWT(newUser);

    return AppResponse(
      res,
      { user: userData, token },
      "Registration Successful. Please verify your email using the link or OTP sent to your email.",
      201
    );
  } catch (error) {
    next(error);
  }
};

// Register new vendor with profile, addresses, and business details
export const vendorRegister = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const requestBody: userRegisterType & vendorRegisterType = req.body;
    vendorregisterSchema.parse(requestBody);

    // Check for existing user or vendor
    const [existingUser, existingVendor] = await Promise.all([
      prisma.user.findUnique({ where: { email: requestBody.email } }),
      prisma.vendorProfile.findUnique({ where: { businessRegNo: requestBody.businessRegNo } })
    ]);

    if (existingUser) throw new AuthError("User with this email already exists");
    if (existingVendor) throw new AuthError("Business registration number already exists");

    // Create new vendor with profile and addresses
    const newUser = await prisma.user.create({
      data: {
        email: requestBody.email,
        passwordHash: Buffer.from(await hashPassword(requestBody.password)),
        role: "VENDOR",
        isVerified: false,
        profile: {
          create: {
            firstName: requestBody.firstName,
            lastName: requestBody.lastName,
            phone: requestBody.phone,
            avatarUrl: requestBody.avatarUrl,
          },
        },
        addresses: {
          create: requestBody.addresses,
        },
        vendorProfile: {
          create: {
            businessName: requestBody.businessName,
            businessRegNo: requestBody.businessRegNo,
            description: requestBody.description,
            website: requestBody.website,
            socialMedia: {
              create: requestBody.socialMedia,
            },
          },
        },
      },
      include: {
        profile: true,
        addresses: true,
        vendorProfile: {
          include: {
            socialMedia: true,
          },
        },
      },
    });

    // Generate OTP and send verification email
    const otp = await otpManager.generateOTP(newUser.id.toString());
    await emailManager.sendVerificationEmail(
      requestBody.email,
      `${process.env.FRONTEND_URL}/verify-email?token=${newUser.id}`,
      otp
    );

    const { passwordHash, ...userData } = newUser;
    const token = generateJWT(newUser);

    return AppResponse(
      res,
      { user: userData, token },
      "Vendor Registration Successful. Please verify your email using the link or OTP sent to your email.",
      201
    );
  } catch (error) {
    next(error);
  }
};

// Resend verification email with new OTP
export const resendVerificationToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) throw new AuthError("Email is required");

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, isVerified: true }
    });

    if (!user) throw new AuthError("User not found");
    if (user.isVerified) throw new AuthError("User is already verified");

    // Generate new OTP and send verification email
    const otp = await otpManager.generateOTP(user.id.toString());
    await emailManager.sendVerificationEmail(
      email,
      `${process.env.FRONTEND_URL}/verify-email?token=${user.id}`,
      otp
    );

    return AppResponse(
      res,
      null,
      "Verification email sent successfully",
      200
    );
  } catch (error) {
    next(error);
  }
};
