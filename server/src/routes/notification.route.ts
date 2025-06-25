import { Router } from 'express';
import * as notificationController from '../controllers/notification.controller';
import { authenticate, authenticateAdmin, authenticateVendor } from '../middlewares/authMiddleware';

const router = Router();

// User notification routes
router.get('/', authenticate, notificationController.getNotifications);
router.get('/unread', authenticate, notificationController.getUnreadCount);
router.put('/:id/read', authenticate, notificationController.markAsRead);
router.put('/read-all', authenticate, notificationController.markAllAsRead);
router.delete('/:id', authenticate, notificationController.deleteNotification);
router.delete('/', authenticate, notificationController.clearNotifications);
router.get('/settings', authenticate, notificationController.getNotificationSettings);
router.put('/settings', authenticate, notificationController.updateNotificationSettings);
router.post('/subscribe', authenticate, notificationController.subscribePush);
router.delete('/unsubscribe', authenticate, notificationController.unsubscribePush);

// Vendor notification routes
router.get('/vendors', authenticateVendor, notificationController.getVendorNotifications);
router.put('/vendors/:id/read', authenticateVendor, notificationController.markVendorAsRead);

// Admin notification routes
router.get('/admin', authenticateAdmin, notificationController.getAdminNotifications);
router.post('/admin/send', authenticateAdmin, notificationController.sendAdminNotification);
router.get('/admin/analytics', authenticateAdmin, notificationController.getAdminNotificationAnalytics);

// Email template routes
router.get('/templates', authenticateAdmin, notificationController.getEmailTemplates);
router.put('/templates/:id', authenticateAdmin, notificationController.updateEmailTemplate);

// SMS routes
router.post('/sms/send', authenticateAdmin, notificationController.sendSMS);
router.get('/sms/status/:messageId', authenticateAdmin, notificationController.getSMSStatus);

export default router; 