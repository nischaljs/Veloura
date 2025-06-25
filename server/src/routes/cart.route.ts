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
router.post('/apply-coupon', authenticate, cartController.applyCoupon);
router.delete('/coupon', authenticate, cartController.removeCoupon);
router.get('/shipping-options', authenticate, cartController.getShippingOptions);
router.post('/calculate-shipping', authenticate, cartController.calculateShipping);
router.get('/analytics', authenticate, cartController.getCartAnalytics);

// Guest Cart Routes (no auth)
router.get('/guest', cartController.getGuestCart);
router.post('/guest/add', cartController.addToGuestCart);
router.post('/guest/merge', authenticate, cartController.mergeGuestCart);

export default router; 