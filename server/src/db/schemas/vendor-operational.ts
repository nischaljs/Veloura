import { binary, date, mysqlTable, time, varchar } from "drizzle-orm/mysql-core";
import { VendorOperationalType } from "./enums";
import { vendors } from "./vendors";


export const vendorOperational = mysqlTable("vendor_operational",{
    vendor_id:varchar("vendor_id",{length:36}).notNull().primaryKey()
        .references(()=>vendors.id,{onDelete:"cascade"}),
    status:VendorOperationalType.notNull(),
    opening_time:time("opening_time"),
    closing_time:time("closing_time"),
    working_days:binary("working_days",{length:1}).notNull(),
    temporary_closure_end:date("temporary_closure_end")

})