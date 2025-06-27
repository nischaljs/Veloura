import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { payments } from '../utils/paymentGateway';
import { PaymentStatus } from '@prisma/client';

export const initiateKhaltiPayment = async (req: Request, res: Response) => {
  try {
    const { orderId, returnUrl, cancelUrl } = req.body;
    const userId = (req as any).userId;
    if (!userId) { res.status(401).json({ success: false, message: 'Unauthorized' }); return; }
    // Fetch order and validate ownership
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order || order.userId !== userId) { res.status(404).json({ success: false, message: 'Order not found' }); return; }
    // Fetch user info
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) { res.status(404).json({ success: false, message: 'User not found' }); return; }
    // Prepare customer info
    const customer_info = {
      name: user.firstName + (user.lastName ? ' ' + user.lastName : ''),
      email: user.email,
      phone: user.phone || ''
    };
    // Create payment
    if (!payments.khalti) { res.status(500).json({ success: false, message: 'Khalti payment gateway not configured' }); return; }
    const payment = await payments.khalti.createPayment({
      amount: order.total * 100, // Khalti expects paisa
      purchase_order_id: String(order.id),
      purchase_order_name: `Order #${order.id}`,
      return_url: returnUrl,
      website_url: process.env.WEBSITE_URL || 'https://yourdomain.com',
      customer_info
    });
    res.json({ success: true, data: { paymentUrl: payment.payment_url } });
  } catch (err: any) {
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

export const initiateEsewaPayment = async (req: Request, res: Response) => {
  try {
    const { orderId, returnUrl, cancelUrl } = req.body;
    const userId = (req as any).userId;
    if (!userId) { res.status(401).json({ success: false, message: 'Unauthorized' }); return; }
    // Fetch order and validate ownership
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order || order.userId !== userId) { res.status(404).json({ success: false, message: 'Order not found' }); return; }
    if (!payments.esewa) { res.status(500).json({ success: false, message: 'eSewa payment gateway not configured' }); return; }
    // Create payment
    const payment = await payments.esewa.createPayment({
      amount: order.total,
      tax_amount: 0,
      total_amount: order.total,
      transaction_uuid: `ORDER_${order.id}_${Date.now()}`,
      product_code: process.env.ESEWA_PRODUCT_CODE || 'EPAYTEST',
      product_service_charge: 0,
      product_delivery_charge: 0,
      success_url: returnUrl,
      failure_url: cancelUrl,
      signed_field_names: 'total_amount,transaction_uuid,product_code'
    });
    res.json({ success: true, data: { formHtml: payment.form_html } });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const verifyEsewaPayment = async (req: Request, res: Response) => {
  try {
    const { token, refId, orderId } = req.body;
    if (!payments.esewa) { res.status(500).json({ success: false, message: 'eSewa payment gateway not configured' }); return; }
    // eSewa verification expects transaction_uuid and total_amount, so we need to find the order by orderId if possible
    const order = orderId ? await prisma.order.findUnique({ where: { id: Number(orderId) } }) : undefined;
    const verification = await payments.esewa.verifyPayment({
      product_code: process.env.ESEWA_PRODUCT_CODE || 'EPAYTEST',
      transaction_uuid: refId,
      total_amount: order ? order.total : 0
    });
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
        amount: verification.amount || 0
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