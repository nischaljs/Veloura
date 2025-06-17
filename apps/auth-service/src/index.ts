import express, { Request, Response } from "express";
import cors from "cors";
import { errorMiddleware } from "@veloura/error-handler";
import cookieParser from "cookie-parser";
import router from "./routes/auth.router";

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 4100;
const host = process.env.HOST ? process.env.HOST : "0.0.0.0";

app.use(
  cors({
    origin: ["http://localhost:3000"],
    allowedHeaders: ["Authorization", "Content-Type"],
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.json({ service: "auth-service", status: "running" });
});

app.use("/", router);

app.use(errorMiddleware);

const server = app.listen(port, host, () => {
  console.log(`✅ Auth Service running on http://localhost:${port}`);
});

server.on("error", (err) => {
  console.error(`🛑 Auth Service error: ${err.message}`);
});
