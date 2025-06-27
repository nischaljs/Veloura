import { Router } from 'express';
import {
  initiateKhaltiPayment,
  verifyKhaltiPayment,
  initiateEsewaPayment,
  verifyEsewaPayment,
  confirmCODPayment
} from '../controllers/payment.controller';

const router = Router();

// Apply authentication middleware as needed (e.g., router.use(authenticateUser))

router.post('/khalti/initiate', initiateKhaltiPayment);
router.post('/khalti/verify', verifyKhaltiPayment);
router.post('/esewa/initiate', initiateEsewaPayment);
router.post('/esewa/verify', verifyEsewaPayment);
router.post('/cod/confirm', confirmCODPayment);

export default router; 