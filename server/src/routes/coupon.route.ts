import { Router } from 'express';
import * as couponController from '../controllers/coupon.controller';
import { authenticate, authenticateAdmin, authenticateVendor } from '../middlewares/authMiddleware';

const router = Router();

// Public coupon routes
router.get('/', couponController.getCoupons);
router.get('/validate', couponController.validateCoupon);

// User coupon routes
router.get('/user', authenticate, couponController.getUserCoupons);
router.post('/claim', authenticate, couponController.claimCoupon);

// Vendor coupon routes
router.get('/vendors/coupons', authenticateVendor, couponController.getVendorCoupons);
router.post('/vendors/coupons', authenticateVendor, couponController.createVendorCoupon);
router.put('/vendors/coupons/:id', authenticateVendor, couponController.updateVendorCoupon);
router.delete('/vendors/coupons/:id', authenticateVendor, couponController.deleteVendorCoupon);
router.get('/vendors/coupons/analytics', authenticateVendor, couponController.getVendorCouponAnalytics);

// Admin coupon routes
router.get('/admin/coupons', authenticateAdmin, couponController.getAdminCoupons);
router.post('/admin/coupons', authenticateAdmin, couponController.createAdminCoupon);
router.put('/admin/coupons/:id', authenticateAdmin, couponController.updateAdminCoupon);
router.delete('/admin/coupons/:id', authenticateAdmin, couponController.deleteAdminCoupon);
router.put('/admin/coupons/:id/activate', authenticateAdmin, couponController.activateCoupon);
router.put('/admin/coupons/:id/deactivate', authenticateAdmin, couponController.deactivateCoupon);
router.get('/admin/coupons/:id/usage', authenticateAdmin, couponController.getCouponUsage);
router.get('/admin/coupons/analytics', authenticateAdmin, couponController.getAdminCouponAnalytics);
router.post('/admin/coupons/bulk-create', authenticateAdmin, couponController.bulkCreateCoupons);
router.post('/admin/coupons/bulk-deactivate', authenticateAdmin, couponController.bulkDeactivateCoupons);

export default router; 