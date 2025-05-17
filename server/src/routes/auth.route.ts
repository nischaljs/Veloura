import { Router, type Request, type Response } from "express";
import authController from "../controllers/auth.controller";


const authRouter = Router();

authRouter.post("/user-login", authController.userLogin);
authRouter.post("/user-register", authController.userRegister);
authRouter.post("/vendor-login", authController.vendorLogin);
authRouter.post("/vendor-register", authController.vendorRegister);
authRouter.post("/logout", authController.logout);


export default authRouter;