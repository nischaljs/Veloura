import { Router } from 'express';
import * as shippingController from '../controllers/shipping.controller';
import { authenticate, authenticateVendor, authenticateAdmin } from '../middlewares/authMiddleware';

const router = Router();

// User shipping endpoints
router.get('/options', shippingController.getShippingOptions);
router.post('/calculate', authenticate, shippingController.calculateShipping);
router.get('/tracking/:trackingNumber', authenticate, shippingController.getTrackingInfo);
router.get('/zones', shippingController.getShippingZones);

// Vendor shipping endpoints
router.get('/vendors/settings', authenticateVendor, shippingController.getVendorShippingSettings);
router.put('/vendors/settings', authenticateVendor, shippingController.updateVendorShippingSettings);
router.get('/vendors/orders', authenticateVendor, shippingController.getVendorShippingOrders);
router.post('/vendors/ship', authenticateVendor, shippingController.markOrderShipped);
router.put('/vendors/update-tracking', authenticateVendor, shippingController.updateTrackingInfo);
router.get('/vendors/analytics', authenticateVendor, shippingController.getVendorShippingAnalytics);

// Admin shipping endpoints
router.get('/admin/carriers', authenticateAdmin, shippingController.getAdminCarriers);
router.post('/admin/carriers', authenticateAdmin, shippingController.addAdminCarrier);
router.put('/admin/carriers/:id', authenticateAdmin, shippingController.updateAdminCarrier);
router.delete('/admin/carriers/:id', authenticateAdmin, shippingController.deleteAdminCarrier);
router.get('/admin/zones', authenticateAdmin, shippingController.getAdminZones);
router.post('/admin/zones', authenticateAdmin, shippingController.addAdminZone);
router.put('/admin/zones/:id', authenticateAdmin, shippingController.updateAdminZone);
router.delete('/admin/zones/:id', authenticateAdmin, shippingController.deleteAdminZone);
router.get('/admin/analytics', authenticateAdmin, shippingController.getAdminShippingAnalytics);

// Shipping label endpoints
router.post('/labels/generate', authenticate, shippingController.generateShippingLabel);
router.get('/labels/:labelId', authenticate, shippingController.getShippingLabel);

export default router; 