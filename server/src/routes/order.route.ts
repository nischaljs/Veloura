import { Router } from 'express';
import * as orderController from '../controllers/order.controller';
import { authenticate, authenticateVendor, authenticateAdmin } from '../middlewares/authMiddleware';

const router = Router();

// User Order Routes
router.post('/', authenticate, orderController.createOrder);
router.get('/', authenticate, orderController.getUserOrders);
router.get('/:id', authenticate, orderController.getOrderDetails);
router.put('/:id/cancel', authenticate, orderController.cancelOrder);
router.post('/:id/return', authenticate, orderController.returnOrder);
router.get('/:id/tracking', authenticate, orderController.getOrderTracking);
router.get('/invoice/:id', authenticate, orderController.getOrderInvoice);

// Vendor Order Routes
router.get('/vendors/orders', authenticateVendor, orderController.getVendorOrders);
router.put('/vendors/orders/:id/status', authenticateVendor, orderController.updateVendorOrderStatus);
router.get('/vendors/orders/analytics', authenticateVendor, orderController.getVendorOrderAnalytics);

// Admin Order Routes
router.get('/admin/orders', authenticateAdmin, orderController.getAdminOrders);
router.put('/admin/orders/:id/status', authenticateAdmin, orderController.updateAdminOrderStatus);
router.get('/admin/orders/analytics', authenticateAdmin, orderController.getAdminOrderAnalytics);

export default router; 