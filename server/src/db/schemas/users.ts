import { sql } from "drizzle-orm";
import { date, mysqlEnum, mysqlTable, varchar } from "drizzle-orm/mysql-core";
import { roles } from "./enums";

export const users = mysqlTable("users", {
    id: varchar("id", { length: 36 }).primaryKey().notNull(),
    email: varchar("email", { length: 255 }).unique().notNull(),
    password: varchar("password", { length: 255 }).notNull(),
    first_name: varchar("first_name", { length: 255 }).notNull(),
    middle_name: varchar("middle_name", { length: 255 }),
    last_name: varchar("last_name", { length: 255 }),
    role: roles.notNull(),
    created_at: date("created_at").default(sql`CURRENT_TIMESTAMP`),
    last_login: date("last_login"),
});