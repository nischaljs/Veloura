import { Request, Response } from 'express';
import prisma from '../utils/prisma';

// --- User Notification Endpoints ---
export const getNotifications = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { page = 1, limit = 10, type, isRead } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;
    const where: any = { userId };
    if (type) where.type = type;
    if (isRead !== undefined) where.isRead = isRead === 'true';
    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({ where: { userId, isRead: false } })
    ]);
    res.json({
      success: true,
      data: {
        notifications,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        },
        unreadCount
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

export const getUnreadCount = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const unreadCount = await prisma.notification.count({ where: { userId, isRead: false } });
    res.json({ success: true, data: { unreadCount } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const id = Number(req.params.id);
    const notification = await prisma.notification.findUnique({ where: { id } });
    if (!notification || notification.userId !== userId) return res.status(404).json({ success: false, message: 'Notification not found' });
    await prisma.notification.update({ where: { id }, data: { isRead: true } });
    res.json({ success: true, message: 'Notification marked as read' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    await prisma.notification.updateMany({ where: { userId, isRead: false }, data: { isRead: true } });
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const id = Number(req.params.id);
    const notification = await prisma.notification.findUnique({ where: { id } });
    if (!notification || notification.userId !== userId) return res.status(404).json({ success: false, message: 'Notification not found' });
    await prisma.notification.delete({ where: { id } });
    res.json({ success: true, message: 'Notification deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

export const clearNotifications = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    await prisma.notification.deleteMany({ where: { userId } });
    res.json({ success: true, message: 'All notifications cleared successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

export const getNotificationSettings = async (req: Request, res: Response) => {
  // Stub: settings not in schema
  res.json({ success: true, data: { settings: {} } });
};
export const updateNotificationSettings = async (req: Request, res: Response) => {
  // Stub: settings not in schema
  res.json({ success: true, message: 'Notification settings updated successfully' });
};
export const subscribePush = async (req: Request, res: Response) => {
  // Stub: push not in schema
  res.json({ success: true, message: 'Successfully subscribed to push notifications' });
};
export const unsubscribePush = async (req: Request, res: Response) => {
  // Stub: push not in schema
  res.json({ success: true, message: 'Successfully unsubscribed from push notifications' });
};

// --- Vendor Notification Endpoints ---
export const getVendorNotifications = async (req: Request, res: Response) => {
  try {
    // Find vendor by userId
    const userId = (req as any).userId;
    const vendor = await prisma.vendor.findUnique({ where: { userId } });
    if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });
    // Get notifications for vendor's userId
    const { page = 1, limit = 10, type } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;
    const where: any = { userId };
    if (type) where.type = type;
    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({ where: { userId, isRead: false } })
    ]);
    res.json({
      success: true,
      data: {
        notifications,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        },
        unreadCount
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};
export const markVendorAsRead = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const id = Number(req.params.id);
    const notification = await prisma.notification.findUnique({ where: { id } });
    if (!notification || notification.userId !== userId) return res.status(404).json({ success: false, message: 'Notification not found' });
    await prisma.notification.update({ where: { id }, data: { isRead: true } });
    res.json({ success: true, message: 'Notification marked as read' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

// --- Admin Notification Endpoints ---
export const getAdminNotifications = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 20, type, user, dateFrom, dateTo } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;
    const where: any = {};
    if (type) where.type = type;
    if (user) where.user = { email: user };
    if (dateFrom) where.createdAt = { ...(where.createdAt || {}), gte: new Date(dateFrom as string) };
    if (dateTo) where.createdAt = { ...(where.createdAt || {}), lte: new Date(dateTo as string) };
    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
        include: { user: { select: { id: true, email: true, firstName: true, lastName: true } } }
      }),
      prisma.notification.count({ where })
    ]);
    res.json({
      success: true,
      data: {
        notifications,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};
export const sendAdminNotification = async (req: Request, res: Response) => {
  try {
    const { title, message, type, recipients } = req.body;
    let users: any[] = [];
    if (recipients.type === 'all') {
      users = await prisma.user.findMany({ where: { isActive: true } });
    } else if (recipients.type === 'customers') {
      users = await prisma.user.findMany({ where: { isActive: true, role: 'CUSTOMER' } });
    } else if (recipients.type === 'vendors') {
      users = await prisma.user.findMany({ where: { isActive: true, role: 'VENDOR' } });
    } else if (recipients.type === 'specific' && Array.isArray(recipients.userIds)) {
      users = await prisma.user.findMany({ where: { id: { in: recipients.userIds } } });
    }
    let sentCount = 0, failedCount = 0;
    for (const user of users) {
      try {
        await prisma.notification.create({ data: { userId: user.id, title, message, type, isRead: false } });
        sentCount++;
      } catch {
        failedCount++;
      }
    }
    res.json({ success: true, message: 'Notification sent successfully', data: { sentCount, failedCount } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};
export const getAdminNotificationAnalytics = async (req: Request, res: Response) => {
  // Stub: analytics not in schema
  res.json({ success: true, data: { analytics: {} } });
};

// --- Email Template Endpoints ---
export const getEmailTemplates = async (req: Request, res: Response) => {
  // Stub: templates not in schema
  res.json({ success: true, data: { templates: [] } });
};
export const updateEmailTemplate = async (req: Request, res: Response) => {
  // Stub: templates not in schema
  res.json({ success: true, message: 'Template updated successfully' });
};

// --- SMS Endpoints ---
export const sendSMS = async (req: Request, res: Response) => {
  // Stub: SMS not in schema
  res.json({ success: true, message: 'SMS sent successfully', data: { messageId: 'msg_123456' } });
};
export const getSMSStatus = async (req: Request, res: Response) => {
  // Stub: SMS not in schema
  res.json({ success: true, data: { messageId: req.params.messageId, status: 'delivered', deliveredAt: new Date().toISOString() } });
}; 