import { Router } from 'express';
import * as adminController from '../controllers/admin.controller';
import { authenticateAdmin } from '../middlewares/authMiddleware';

const router = Router();

// User Management
router.get('/users', authenticateAdmin, adminController.getUsers);
router.get('/users/:id', authenticateAdmin, adminController.getUserById);
router.put('/users/:id', authenticateAdmin, adminController.updateUser);
router.delete('/users/:id', authenticateAdmin, adminController.deleteUser);
router.put('/users/:id/activate', authenticateAdmin, adminController.activateUser);
router.put('/users/:id/deactivate', authenticateAdmin, adminController.deactivateUser);

// Vendor Management
router.get('/vendors', authenticateAdmin, adminController.getVendors);
router.get('/vendors/:id', authenticateAdmin, adminController.getVendorById);
router.put('/vendors/:id/approve', authenticateAdmin, adminController.approveVendor);
router.put('/vendors/:id/reject', authenticateAdmin, adminController.rejectVendor);
router.put('/vendors/:id/suspend', authenticateAdmin, adminController.suspendVendor);

// --- Payout Management ---
router.get('/payout-requests', authenticateAdmin, adminController.getPayoutRequests);
router.put('/payout-requests/:id/approve', authenticateAdmin, adminController.approvePayoutRequest);
router.put('/payout-requests/:id/reject', authenticateAdmin, adminController.rejectPayoutRequest);

// Product Management
router.get('/products', authenticateAdmin, adminController.getProducts);
router.put('/products/:id/status', authenticateAdmin, adminController.updateProductStatus);
router.delete('/products/:id', authenticateAdmin, adminController.deleteProduct);



// Analytics
router.get('/analytics/dashboard', authenticateAdmin, adminController.getDashboardAnalytics);
router.get('/analytics/vendors', authenticateAdmin, adminController.getVendorAnalytics);
router.get('/analytics/basic', authenticateAdmin, adminController.getBasicAnalytics);
router.get('/analytics/commissions', authenticateAdmin, adminController.getCommissionAnalytics);
router.get('/analytics/vendor/:vendorId', authenticateAdmin, adminController.getVendorAnalytics);




export default router; 