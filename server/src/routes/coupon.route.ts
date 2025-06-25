import { Router } from 'express';
import * as couponController from '../controllers/coupon.controller';
import { requireAuth, requireAdmin, requireVendor } from '../middleware/auth';

const router = Router();

// Public coupon routes
router.get('/', couponController.getCoupons);
router.get('/validate', couponController.validateCoupon);

// User coupon routes
router.get('/user', requireAuth, couponController.getUserCoupons);
router.post('/claim', requireAuth, couponController.claimCoupon);

// Vendor coupon routes
router.get('/vendors/coupons', requireVendor, couponController.getVendorCoupons);
router.post('/vendors/coupons', requireVendor, couponController.createVendorCoupon);
router.put('/vendors/coupons/:id', requireVendor, couponController.updateVendorCoupon);
router.delete('/vendors/coupons/:id', requireVendor, couponController.deleteVendorCoupon);
router.get('/vendors/coupons/analytics', requireVendor, couponController.getVendorCouponAnalytics);

// Admin coupon routes
router.get('/admin/coupons', requireAdmin, couponController.getAdminCoupons);
router.post('/admin/coupons', requireAdmin, couponController.createAdminCoupon);
router.put('/admin/coupons/:id', requireAdmin, couponController.updateAdminCoupon);
router.delete('/admin/coupons/:id', requireAdmin, couponController.deleteAdminCoupon);
router.put('/admin/coupons/:id/activate', requireAdmin, couponController.activateCoupon);
router.put('/admin/coupons/:id/deactivate', requireAdmin, couponController.deactivateCoupon);
router.get('/admin/coupons/:id/usage', requireAdmin, couponController.getCouponUsage);
router.get('/admin/coupons/analytics', requireAdmin, couponController.getAdminCouponAnalytics);
router.post('/admin/coupons/bulk-create', requireAdmin, couponController.bulkCreateCoupons);
router.post('/admin/coupons/bulk-deactivate', requireAdmin, couponController.bulkDeactivateCoupons);

export default router; 