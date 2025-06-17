import { z } from "zod";

export const authSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
  role: z.enum(["CUSTOMER", "VENDOR", "ADMIN"], { message: "Invalid role" }),
  addresses: z.array(
    z.object({
      street: z.string(),
      city: z.string(),
      state: z.string(),
      zipCode: z.string(),
      country: z.string(),
      isDefault: z.boolean(),
    }),
  ),
});

export const userregisterSchema = authSchema.extend({
  firstName: z.string(),
  lastName: z.string(),
  phone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits" }),
  avatarUrl: z.string().url().optional(),
});

export const vendorregisterSchema = authSchema.extend({
  businessName: z.string(),
  businessRegNo: z.string().min(10, {
    message: "Business registration number must be at least 10 digits",
  }),
  description: z.string().optional(),
  website: z.string().url().optional(),
  socialMedia: z.array(
    z.object({
      platform: z.enum([
        "Instagram",
        "Facebook",
        "Twitter",
        "Youtube",
        "Linkedin",
      ]),
      url: z.string().url(),
    }),
  ),
});

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
  rememberMe: z.boolean().optional(),
});

export type userRegisterType = z.infer<typeof userregisterSchema>;
export type vendorRegisterType = z.infer<typeof vendorregisterSchema>;
export type loginType = z.infer<typeof loginSchema>;
