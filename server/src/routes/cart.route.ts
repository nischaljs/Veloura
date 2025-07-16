import { Router } from 'express';
import * as cartController from '../controllers/cart.controller';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

// Authenticated Cart Routes
router.get('/', authenticate, cartController.getCart);
router.post('/add', authenticate, cartController.addToCart);
router.put('/:itemId', authenticate, cartController.updateCartItem);
router.delete('/:itemId', authenticate, cartController.removeCartItem);
router.delete('/', authenticate, cartController.clearCart);

export default router; 