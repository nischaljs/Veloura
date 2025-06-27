import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import bcrypt from 'bcrypt';
import path from 'path';

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) { res.status(404).json({ success: false, message: 'User not found' }); return; }
    res.json({ success: true, data: { user } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { firstName, lastName, phone } = req.body;
    const user = await prisma.user.update({ where: { id: userId }, data: { firstName, lastName, phone } });
    res.json({ success: true, message: 'Profile updated successfully', data: { user } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

export const uploadAvatar = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    if (!req.file) { res.status(400).json({ success: false, message: 'No file uploaded' }); return; }
    const avatarPath = '/images/users/' + path.basename(req.file.path);
    const user = await prisma.user.update({ where: { id: userId }, data: { avatar: avatarPath } });
    res.json({ success: true, message: 'Avatar uploaded successfully', data: { avatar: avatarPath } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

export const deleteAvatar = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    await prisma.user.update({ where: { id: userId }, data: { avatar: null } });
    res.json({ success: true, message: 'Avatar removed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { currentPassword, newPassword } = req.body;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) { res.status(404).json({ success: false, message: 'User not found' }); return; }
    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) { res.status(400).json({ success: false, message: 'Current password is incorrect' }); return; }
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { id: userId }, data: { passwordHash } });
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

// Address endpoints
export const getAddresses = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const addresses = await prisma.address.findMany({ where: { userId } });
    res.json({ success: true, data: { addresses } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};
export const addAddress = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const data = { ...req.body, userId };
    const address = await prisma.address.create({ data });
    res.json({ success: true, message: 'Address added successfully', data: { address } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};
export const updateAddress = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const id = Number(req.params.id);
    const address = await prisma.address.update({ where: { id }, data: req.body });
    res.json({ success: true, message: 'Address updated successfully', data: { address } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};
export const deleteAddress = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const id = Number(req.params.id);
    await prisma.address.delete({ where: { id } });
    res.json({ success: true, message: 'Address deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};
export const setDefaultAddress = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const id = Number(req.params.id);
    // Set all addresses to not default
    await prisma.address.updateMany({ where: { userId }, data: { isDefault: false } });
    // Set selected address to default
    await prisma.address.update({ where: { id }, data: { isDefault: true } });
    res.json({ success: true, message: 'Default address updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

// User orders
export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { page = 1, limit = 10, status } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;
    const where: any = { userId };
    if (status) where.status = status;
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
        include: {
          items: true,
        }
      }),
      prisma.order.count({ where })
    ]);
    res.json({
      success: true,
      data: {
        orders,
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
export const getUserOrderDetails = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const id = Number(req.params.id);
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        payments: true,
        shipments: true,
      }
    });
    if (!order || order.userId !== userId) { res.status(404).json({ success: false, message: 'Order not found' }); return; }
    res.json({ success: true, data: { order } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
}; 