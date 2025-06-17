import { Router } from "express";
import { customerRegister, vendorRegsiter, login } from "../controller/auth.controller";

const router: Router = Router();

router.post("/customer-register", customerRegister);

router.post("/vendor-register",vendorRegsiter)


router.post("/login", login);

export default router;
