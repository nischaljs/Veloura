import { Router } from 'express';
import * as reviewController from '../controllers/review.controller';
import { authenticate, authenticateVendor, authenticateAdmin } from '../middlewares/authMiddleware';

const router = Router();

// User review routes
router.post('/', authenticate, reviewController.createReview);
router.get('/product/:productId', reviewController.getProductReviews);
router.get('/user', authenticate, reviewController.getUserReviews);
router.put('/:id', authenticate, reviewController.updateReview);
router.delete('/:id', authenticate, reviewController.deleteReview);
router.post('/:id/images', authenticate, reviewController.uploadReviewImages);
router.get('/summary/:productId', reviewController.getProductReviewSummary);

// Helpfulness
router.post('/:id/helpful', authenticate, reviewController.markHelpful);
router.post('/:id/unhelpful', authenticate, reviewController.markUnhelpful);
router.get('/:id/helpfulness', authenticate, reviewController.getHelpfulnessStats);

// Vendor review management
router.get('/vendors/reviews', authenticateVendor, reviewController.getVendorReviews);
router.get('/vendors/reviews/analytics', authenticateVendor, reviewController.getVendorReviewAnalytics);

// Admin review management
router.get('/admin/reviews', authenticateAdmin, reviewController.getAdminReviews);
router.put('/admin/reviews/:id/approve', authenticateAdmin, reviewController.approveReview);
router.put('/admin/reviews/:id/reject', authenticateAdmin, reviewController.rejectReview);
router.delete('/admin/reviews/:id', authenticateAdmin, reviewController.deleteReviewAdmin);
router.get('/admin/reviews/analytics', authenticateAdmin, reviewController.getAdminReviewAnalytics);

export default router; 