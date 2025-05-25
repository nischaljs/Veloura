import express, { Request, Response } from "express";
import * as path from "path";
import cors from "cors";
import proxy from "express-http-proxy";
import moragn from "morgan";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import axios from "axios";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

app.use(
  cors({
    origin: ["http://localhost:3000"],
    allowedHeaders: ["Authorization", "Content-Type"],
    credentials: true,
  }),
);

app.use(moragn("dev"));
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.use(cookieParser());

//what does the below line do?
//the trust proxy is used to tell express that the app is behind a proxy
//and to trust the X-Forwarded-For header in order to get the correct IP address
//of the client making the request to the server
//the 1 means that the proxy is trusted

app.set("trust proxy", 1);

//Api rate limiting middleware the rate limit middleware is used to limit the number of requests that can be made to the server
// per time period the standard headers are used to identify the client making the request
// the legacy headers are used to identify the client making the request in older versions of express
// the key generator is used to generate a unique key for each request to identify the client making the request
// the max is the maximum number of requests that can be made in the time period
// the message is the error message that is sent to the client if the limit is exceeded
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: (req: any) => (req.user ? 1000 : 100),
  message: { error: "Too many requests, please try again later" },
  standardHeaders: true,
  legacyHeaders: true,
  keyGenerator: (req: any) => req.ip,
});

app.use(limiter);

app.use("assets", express.static(path.join(__dirname, "../assets")));

app.get("/test", (req: Request, res: Response) => {
  res.json({ service: "api gateway-service", status: "running" });
});

// the below line is uses to forward the request to the api gateway
// the proxy function is used to forward the request to the api gateway
// the target is the url of the api gateway
app.use("/auth", proxy("http://localhost:4100"));

app.listen(PORT, () => {
  console.log(`api gateway service running at ${PORT}`);
});
