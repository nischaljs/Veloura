import { mysqlEnum } from "drizzle-orm/mysql-core";

export const verificationStatus = mysqlEnum("verification_status", ["PENDING", "VERIFIED", "REJECTED"]);

export const roles = mysqlEnum("role", ["CUSTOMER", "VENDOR", "ADMIN"]);

export const paymentType = mysqlEnum("payment_type", ["BANK", "ESEWA", "KHALTI", "CONNECT_IPS"]);

export const VendorOperationalType = mysqlEnum("operational_status",["OPEN","CLOSE","ON_BREAK"])