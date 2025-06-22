import { Router } from 'express';
import { 
  register, 
  login, 
  getCurrentUser, 
  logout, 
  refreshToken, 
  forgotPassword, 
  resetPassword, 
  verifyEmail 
} from '../controllers/auth.controller';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

router.post('/register', (req, res) => register(req, res));
router.post('/login', (req, res) => login(req, res));
router.post('/logout', (req, res) => logout(req, res));
router.get('/me', authenticate, (req, res) => getCurrentUser(req, res));

// 🔴 Yet to implement routes
router.post('/refresh', (req, res) => refreshToken(req, res));
router.post('/forgot-password', (req, res) => forgotPassword(req, res));
router.post('/reset-password', (req, res) => resetPassword(req, res));
router.post('/verify-email', (req, res) => verifyEmail(req, res));

export default router;
