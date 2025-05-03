import express from "express";
import type { Request, Response } from "express";
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from "mysql2/promise"
const connection = await mysql.createConnection({
  uri:process.env.DATABASE_URL!
});
const db = drizzle(connection);
const app = express();
app.use(express.json());
app.use(express.static(`${import.meta.path}/public`));
app.use(express.urlencoded({extended:true}))



app.get("/", (req: Request, res: Response):void => {
     res.status(200).json({
      message: "Hello the server is running"
    });
  });
  


app.listen(process.env.PORT || 3000,()=>{
    console.log(`port is being listened at ${process.env.PORT}`)
})