
import { boolean, mysqlTable, varchar } from "drizzle-orm/mysql-core";
import { paymentType, verificationStatus } from "./enums";
import { vendors } from "./vendors";


export const vendorPaymentMethods = mysqlTable("vendor_payment_methods", {
    id: varchar("id", { length: 36 }).primaryKey().notNull(),
    vendor_id: varchar("vendor_id", { length: 36 })
        .notNull()
        .references(() => vendors.id, { onDelete: "cascade" }),

    type: paymentType.notNull(),
    is_primary: boolean("is_primary").default(false),
    verification_status: verificationStatus.notNull().default("PENDING"),
});

export const vendorBankDetails = mysqlTable("vendor_bank_details", {
    payment_method_id: varchar("payment_method_id", { length: 36 })
    .primaryKey()
    .references(() => vendorPaymentMethods.id, { onDelete: "cascade" }),
    account_name: varchar("account_name", { length: 256 }).notNull(),
    account_number: varchar("account_number", { length: 256 }).notNull(),
    bank_name: varchar("bank_name", { length: 100 }).notNull(),
});

export const vendorWalletDetails = mysqlTable("vendor_wallet_details", {
    payment_method_id: varchar("payment_method_id", { length: 36 })
    .primaryKey()
    .references(() => vendorPaymentMethods.id, { onDelete: "cascade" }),
    phone_number: varchar("phone_number", { length: 36 }).notNull(),

})