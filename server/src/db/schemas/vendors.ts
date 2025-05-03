import { sql } from "drizzle-orm";
import { date, mysqlEnum, mysqlTable, varchar } from "drizzle-orm/mysql-core";
import { users } from "./users";
import { verificationStatus } from "./enums";


export const vendors = mysqlTable("vendors", {
    id: varchar("id", { length: 36 }).primaryKey().notNull(),
    user_id: varchar("user_id", { length: 36 })
        .notNull()
        .unique()
        .references(() => users.id, { onDelete: "cascade" }),
    business_name: varchar("business_name", { length: 255 }).notNull(),
    description: varchar("description", { length: 1000 }),
    verification_status: verificationStatus.notNull().default("PENDING"),
    verified_by: varchar("verified_by", { length: 36 })
        .references(() => users.id),
    verification_date: date("verification_date"),
    pan_number: varchar("pan_number", { length: 36 }),
    vat_number: varchar("vat_number", { length: 36 }),
});