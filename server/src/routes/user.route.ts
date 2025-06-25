import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { authenticate } from '../middlewares/authMiddleware';
import { upload, handleUploadError } from '../middlewares/uploadMiddleware';

const router = Router();

router.get('/profile', authenticate, userController.getProfile);
router.put('/profile', authenticate, userController.updateProfile);
router.post('/avatar', authenticate, upload.single('avatar'), handleUploadError, userController.uploadAvatar);
router.delete('/avatar', authenticate, userController.deleteAvatar);
router.put('/password', authenticate, userController.changePassword);

// Address routes
router.get('/addresses', authenticate, userController.getAddresses);
router.post('/addresses', authenticate, userController.addAddress);
router.put('/addresses/:id', authenticate, userController.updateAddress);
router.delete('/addresses/:id', authenticate, userController.deleteAddress);
router.put('/addresses/:id/default', authenticate, userController.setDefaultAddress);

// User orders
router.get('/orders', authenticate, userController.getUserOrders);
router.get('/orders/:id', authenticate, userController.getUserOrderDetails);

export default router; 