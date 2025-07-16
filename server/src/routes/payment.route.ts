import { Router } from 'express';
import {
  initiateKhaltiPayment,
  verifyKhaltiPayment,
  confirmCODPayment
} from '../controllers/payment.controller';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

// Apply authentication middleware to all payment routes
router.use(authenticate);

router.post('/khalti/initiate', initiateKhaltiPayment);
router.post('/khalti/verify', verifyKhaltiPayment);
router.post('/cod/confirm', confirmCODPayment);

export default router; 