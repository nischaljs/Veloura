import { Router } from "express";
import authRouter from "./auth.route";

const router = Router();

router.get("/", (req, res) => {
    res.send("Hello World!");
});

router.use("/auth",authRouter);



export default router;