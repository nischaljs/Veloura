import { Router } from 'express';
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

// Public vendor profile and data
router.get('/:slug', vendorController.getPublicVendorProfile);
router.get('/:slug/products', vendorController.getVendorProducts);
router.get('/:slug/reviews', vendorController.getVendorReviews);

// Bank details
router.get('/bank-details', authenticateVendor, vendorController.getBankDetails);
router.post('/bank-details', authenticateVendor, vendorController.addBankDetail);
router.put('/bank-details/:id', authenticateVendor, vendorController.updateBankDetail);
router.delete('/bank-details/:id', authenticateVendor, vendorController.deleteBankDetail);

// Policies
router.get('/policies', authenticateVendor, vendorController.getPolicies);
router.post('/policies', authenticateVendor, vendorController.addPolicy);
router.put('/policies/:id', authenticateVendor, vendorController.updatePolicy);
router.delete('/policies/:id', authenticateVendor, vendorController.deletePolicy);

// Analytics
router.get('/analytics', authenticateVendor, vendorController.getVendorAnalytics);

export default router; 