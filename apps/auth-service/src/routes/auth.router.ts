import { Router } from "express";
import { 
  customerRegister, 
  vendorRegister, 
  login, 
  verifyUserEmail,
  resendVerificationToken 
} from "../controller/auth.controller";

const router: Router = Router();

// Registration routes
router.post("/customer-register", customerRegister);
router.post("/vendor-register", vendorRegister);

// Authentication routes
router.post("/login", login);

// Email verification routes
router.post("/verify-email", verifyUserEmail);
router.post("/resend-verification", resendVerificationToken);

export default router;
