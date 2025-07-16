import { Router } from 'express';
console.log('Vendor routes loaded');
import * as vendorController from '../controllers/vendor.controller';
import { authenticate, authenticateVendor } from '../middlewares/authMiddleware';
import { upload, handleUploadError } from '../middlewares/uploadMiddleware';
import { createPayoutRequest, getPayoutRequests } from '../controllers/vendor.controller';

const router = Router();

// Vendor registration and profile
router.post('/register', authenticate, vendorController.registerVendor);
router.get('/profile', authenticateVendor, vendorController.getVendorProfile);
router.put('/profile', authenticateVendor, vendorController.updateVendorProfile);
router.post('/logo', authenticateVendor, upload.single('logo'), handleUploadError, vendorController.uploadLogo);
router.post('/banner', authenticateVendor, upload.single('banner'), handleUploadError, vendorController.uploadBanner);

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

// Payout Requests
router.post('/payout-requests', authenticateVendor, createPayoutRequest);
router.get('/payout-requests', authenticateVendor, getPayoutRequests);

export default router; 