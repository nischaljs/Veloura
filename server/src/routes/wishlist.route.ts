import { Router } from 'express';
import * as wishlistController from '../controllers/wishlist.controller';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

// Authenticated Wishlist Routes
router.get('/', authenticate, wishlistController.getWishlist);
router.post('/add', authenticate, wishlistController.addToWishlist);
router.delete('/:itemId', authenticate, wishlistController.removeWishlistItem);
router.delete('/', authenticate, wishlistController.clearWishlist);
router.post('/:itemId/move-to-cart', authenticate, wishlistController.moveToCart);
router.post('/move-all-to-cart', authenticate, wishlistController.moveAllToCart);
router.get('/analytics', authenticate, wishlistController.getWishlistAnalytics);

export default router; 