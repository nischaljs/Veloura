import { Router } from 'express';
console.log('Vendor routes loaded');
import * as vendorController from '../controllers/vendor.controller';
import { authenticate, authenticateVendor } from '../middlewares/authMiddleware';
import { upload, handleUploadError } from '../middlewares/uploadMiddleware';

const router = Router();

// Vendor registration and profile
router.post('/register', authenticate, vendorController.registerVendor);
router.get('/profile', authenticateVendor, vendorController.getVendorProfile);
router.put('/profile', authenticateVendor, vendorController.updateVendorProfile);
router.post('/logo', authenticateVendor, upload.single('logo'), handleUploadError, vendorController.uploadLogo);
router.post('/banner', authenticateVendor, upload.single('banner'), handleUploadError, vendorController.uploadBanner);

// Analytics
router.get('/analytics', (req, res, next) => { console.log('=== /api/vendors/analytics route hit ==='); next(); }, authenticateVendor, vendorController.getVendorAnalytics);

// Product Management (for logged-in vendor)
router.get('/products', authenticateVendor, vendorController.getMyProducts);
router.post('/products', authenticateVendor, vendorController.addProduct);
router.put('/products/:id', authenticateVendor, vendorController.updateProduct);
router.delete('/products/:id', authenticateVendor, vendorController.deleteProduct);

// Public vendor profile and data
router.get('/:slug', vendorController.getPublicVendorProfile);
router.get('/:slug/products', vendorController.getVendorProducts);
router.get('/:slug/reviews', vendorController.getVendorReviews);

// Bank details
router.get('/bank-details', (req, res, next) => { console.log('DEBUG: Reached /bank-details GET route'); next(); }, authenticateVendor, vendorController.getBankDetails);
router.post('/bank-details', (req, res, next) => { console.log('DEBUG: Reached /bank-details POST route'); next(); }, authenticateVendor, vendorController.addBankDetail);
router.put('/bank-details/:id', authenticateVendor, vendorController.updateBankDetail);
router.delete('/bank-details/:id', authenticateVendor, vendorController.deleteBankDetail);

// Policies
router.get('/policies', authenticateVendor, vendorController.getPolicies);
router.post('/policies', authenticateVendor, vendorController.addPolicy);
router.put('/policies/:id', authenticateVendor, vendorController.updatePolicy);
router.delete('/policies/:id', authenticateVendor, vendorController.deletePolicy);

export default router; 