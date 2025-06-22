import { Router } from 'express';
import { register, login, getCurrentUser, logout } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

router.post('/register', (req, res) => register(req, res));
router.post('/login', (req, res) => login(req, res));
router.post('/logout', (req, res) => logout(req, res));
router.get('/me', authenticate, (req, res) => getCurrentUser(req, res));

export default router;
