import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { payments } from '../utils/paymentGateway';
import { PaymentStatus } from '@prisma/client';

export const initiateKhaltiPayment = async (req: Request, res: Response) => {
  try {
    const { orderId, returnUrl, cancelUrl } = req.body;
    const userId = (req as any).userId;
    console.log('[Khalti] initiateKhaltiPayment called:', { userId, orderId, returnUrl, cancelUrl });
    if (!userId) {
      console.log('[Khalti] No userId found on request');
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }
    // Fetch order and validate ownership
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    console.log('[Khalti] Order lookup result:', order);
    if (!order || order.userId !== userId) {
      console.log('[Khalti] Order not found or not owned by user', { order, userId });
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }
    // Fetch user info
    const user = await prisma.user.findUnique({ where: { id: userId } });
    console.log('[Khalti] User lookup result:', user);
    if (!user) {
      console.log('[Khalti] User not found', { userId });
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    // Prepare customer info
    const customer_info = {
      name: user.firstName + (user.lastName ? ' ' + user.lastName : ''),
      email: user.email,
      phone: user.phone || ''
    };
    // Create payment
    if (!payments.khalti) {
      console.log('[Khalti] Payment gateway not configured');
      res.status(500).json({ success: false, message: 'Khalti payment gateway not configured' });
      return;
    }
    try {
      const payment = await payments.khalti.createPayment({
        amount: Math.round(order.total.toNumber() * 100), // Khalti expects integer paisa
        purchase_order_id: String(order.id),
        purchase_order_name: `Order #${order.id}`,
        return_url: returnUrl,
        website_url: process.env.WEBSITE_URL || 'https://yourdomain.com',
        customer_info
      });
      console.log('[Khalti] Payment created:', payment);
      res.json({ success: true, data: { paymentUrl: payment.payment_url } });
    } catch (khaltiErr: any) {
      console.log('[Khalti] Error from Khalti payment gateway:', khaltiErr?.response?.data || khaltiErr);
      res.status(500).json({ success: false, message: khaltiErr?.response?.data?.message || khaltiErr.message || 'Khalti payment error' });
    }
  } catch (err: any) {
    console.log('[Khalti] General error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const verifyKhaltiPayment = async (req: Request, res: Response) => {
  try {
    const { pidx, orderId } = req.body;
    if (!payments.khalti) { res.status(500).json({ success: false, message: 'Khalti payment gateway not configured' }); return; }
    const verification = await payments.khalti.verifyPayment({ pidx });
    // Normalize status to match enum
    const normalizedStatus = (verification.status || '').toUpperCase();
    // Use orderId from request body for updating order status
    if (orderId) {
      await prisma.order.update({
        where: { id: Number(orderId) },
        data: {
          paymentStatus: normalizedStatus === 'COMPLETED' ? PaymentStatus.COMPLETED : PaymentStatus.PENDING,
          status: normalizedStatus === 'COMPLETED' ? 'PROCESSING' : 'PENDING'
        }
      });
    }
    res.json({
      success: true,
      data: {
        status: normalizedStatus,
        transactionId: verification.transaction_id || '',
        amount: verification.amount ? verification.amount / 100 : 0 // convert paisa to rupees
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const confirmCODPayment = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.body;
    const userId = (req as any).userId;
    if (!userId) { res.status(401).json({ success: false, message: 'Unauthorized' }); return; }
    // Fetch order and validate ownership
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order || order.userId !== userId) { res.status(404).json({ success: false, message: 'Order not found' }); return; }
    // Mark order as pending COD in DB
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentMethod: 'COD',
        paymentStatus: PaymentStatus.PENDING,
        status: 'PENDING'
      }
    });
    res.json({ success: true, data: { status: 'PENDING', method: 'COD' } });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}; 