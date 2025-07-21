import prisma from '../utils/prisma';
import { Request, Response, NextFunction } from 'express';
import { calculateShippingFee, calculateTaxAmount, calculateDiscountAmount } from '../utils/cartUtils';
import { Prisma } from '@prisma/client';

/**
 * Create a new order
 */
export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId;
    const { items, shippingAddress, paymentMethod, customerNote, couponCode } = req.body;
    // Require items in the request body
    if (!items || !items.length) {
      res.status(400).json({ success: false, message: 'No items provided' });
      return;
    }
    let orderItems = items;
    // Calculate totals
    let subtotal = 0;
    const orderItemData: Prisma.OrderItemUncheckedCreateWithoutOrderInput[] = [];
    for (const item of orderItems) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) { res.status(400).json({ success: false, message: 'Product not found' });
      return;
    }
      let variant = null;
      const price = (product.salePrice ?? product.price);
      subtotal += (price ? price.toNumber() : 0) * item.quantity;
      orderItemData.push({
        productId: product.id,
        vendorId: item.vendorId ?? undefined,
        quantity: item.quantity,
        price,
        salePrice: product.salePrice ?? null,
        productSnapshot: {
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          salePrice: product.salePrice,
          sku: product.sku,
        },
      });
    }
    const shippingFee = calculateShippingFee();
    const taxAmount = calculateTaxAmount(subtotal);
    // Use couponCode from request body
    const discountAmount = await calculateDiscountAmount(subtotal, couponCode);
    const total = subtotal + shippingFee + taxAmount - discountAmount;
    // Generate order number
    const orderNumber = 'ORD-' + Date.now();
    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId,
        status: 'PENDING',
        paymentMethod,
        paymentStatus: 'PENDING',
        subtotal,
        shippingFee,
        total,
        shippingAddress,
        customerNote,
        items: { create: orderItemData }
      },
      include: { items: true }
    });
    // After order is created, update product stock and status, and create commission records
    for (const item of order.items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (product) {
        const newStock = product.stockQuantity - item.quantity;
        let newStatus = product.status;
        if (newStock <= 0) newStatus = 'OUT_OF_STOCK';
        else if (product.status === 'OUT_OF_STOCK' && newStock > 0) newStatus = 'ACTIVE';
        await prisma.product.update({
          where: { id: product.id },
          data: { stockQuantity: newStock, status: newStatus }
        });
        // Create commission record (10% commission) only if vendorId is a number
        if (typeof item.vendorId === 'number') {
          await prisma.commission.create({
            data: {
              orderItemId: item.id,
              vendorId: item.vendorId,
              amount: item.price.toNumber() * item.quantity * 0.1
            }
          });
        }
      }
    }
    // Remove cart/cartItem logic
    // Optionally, clear cart (removed)
    // const cart = await prisma.cart.findUnique({ where: { userId } });
    // await prisma.cartItem.deleteMany({ where: { cartId: cart?.id } });
    // Return order
    res.json({ success: true, message: 'Order created successfully', data: { order } });
  } catch (err) {
    next(err);
  }
};

/**
 * Get user orders (paginated)
 */
export const getUserOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId;
    const { page = 1, limit = 10, status, paymentStatus } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const where: any = { userId };
    if (status) where.status = status;
    if (paymentStatus) where.paymentStatus = paymentStatus;
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip: Number(skip),
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: { items: true }
      }),
      prisma.order.count({ where })
    ]);
    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get order details
 */
export const getOrderDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id: Number(id) },
      include: { items: true, payments: true, shipments: true }
    });
    if (!order || order.userId !== userId) { res.status(404).json({ success: false, message: 'Order not found' }); return; }
    res.json({ success: true, data: { order } });
  } catch (err) {
    next(err);
  }
};

/**
 * Cancel order
 */
export const cancelOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;
    const order = await prisma.order.findUnique({ where: { id: Number(id) } });
    if (!order || order.userId !== userId) { res.status(404).json({ success: false, message: 'Order not found' }); return; }
    if (order.status !== 'PENDING' && order.status !== 'PROCESSING') { res.status(400).json({ success: false, message: 'Order cannot be cancelled' }); return; }
    await prisma.order.update({ where: { id: order.id }, data: { status: 'CANCELLED' } });
    res.json({ success: true, message: 'Order cancelled successfully' });
  } catch (err) {
    next(err);
  }
};

/**
 * Request order return
 */
export const returnOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;
    const order = await prisma.order.findUnique({ where: { id: Number(id) } });
    if (!order || order.userId !== userId) { res.status(404).json({ success: false, message: 'Order not found' }); return; }
    if (order.status !== 'DELIVERED') { res.status(400).json({ success: false, message: 'Order cannot be returned' }); return; }
    await prisma.order.update({ where: { id: order.id }, data: { status: 'RETURNED' } });
    res.json({ success: true, message: 'Return request submitted successfully' });
  } catch (err) {
    next(err);
  }
};

/**
 * Get order tracking info
 */
export const getOrderTracking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;
    const order = await prisma.order.findUnique({ where: { id: Number(id) }, include: { shipments: true } });
    if (!order || order.userId !== userId) { res.status(404).json({ success: false, message: 'Order not found' }); return; }
    // For now, return shipment info or mock data
    res.json({ success: true, data: { tracking: order.shipments?.[0] || {} } });
  } catch (err) {
    next(err);
  }
};

/**
 * Get order invoice
 */
export const getOrderInvoice = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;
    const order = await prisma.order.findUnique({ where: { id: Number(id) }, include: { items: true, payments: true } });
    if (!order || order.userId !== userId) { res.status(404).json({ success: false, message: 'Order not found' }); return; }
    // For now, return order as invoice
    res.json({ success: true, data: { invoice: order } });
  } catch (err) {
    next(err);
  }
  };

/**
 * Vendor: Get vendor's orders (paginated)
 */
export const getVendorOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const vendorId = (req as any).vendorId;
    const { page = 1, limit = 10, status } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const where: any = { items: { some: { vendorId } } };
    if (status) where.status = status;
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip: Number(skip),
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: { items: true, user: { select: { firstName: true, lastName: true } } }
      }),
      prisma.order.count({ where })
    ]);
    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Vendor: Update order status for their items
 */
export const updateVendorOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const vendorId = (req as any).vendorId;
    const { id } = req.params;
    const { status } = req.body;
    // Only update items belonging to this vendor
    const order = await prisma.order.findUnique({ where: { id: Number(id) }, include: { items: true } });
    if (!order) { res.status(404).json({ success: false, message: 'Order not found' }); return; }
    const vendorItems = order.items.filter(item => item.vendorId === vendorId);
    if (!vendorItems.length) { res.status(403).json({ success: false, message: 'No items for this vendor in order' }); return; }
    // Actually update the order status if vendor is associated
    await prisma.order.update({ where: { id: order.id }, data: { status } });
    res.json({ success: true, message: 'Order status updated' });
  } catch (err) {
    next(err);
  }
};

/**
 * Vendor: Get single order details for a vendor
 */
export const getVendorOrderDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const vendorId = (req as any).vendorId;
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id: Number(id), items: { some: { vendorId } } },
      include: {
        items: {
          include: {
            product: true, // Include product details for each item
          },
        },
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    // Check if any item in the order belongs to the authenticated vendor
    // const isVendorOrder = order.items.some(item => item.vendorId === vendorId);

    // if (!isVendorOrder) {
    //   return res.status(403).json({ success: false, message: 'Access denied: Order does not belong to this vendor' });
    // }

    res.json({ success: true, data: { order } });
  } catch (err) {
    next(err);
  }
};

/**
 * Vendor: Order analytics
 */
export const getVendorOrderAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const vendorId = (req as any).vendorId;
    // Count, total sales, status breakdown
    const [count, totalSales, statusCounts] = await Promise.all([
      prisma.order.count({ where: { items: { some: { vendorId } } } }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { items: { some: { vendorId } }, status: { not: 'CANCELLED' } }
      }),
      prisma.order.groupBy({
        by: ['status'],
        where: { items: { some: { vendorId } } },
        _count: { _all: true }
      })
    ]);
    res.json({
      success: true,
      data: {
        totalOrders: count,
        totalSales: totalSales._sum.total || 0,
        statusBreakdown: statusCounts.map(s => ({ status: s.status, count: s._count._all }))
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Admin: Get all orders (paginated)
 */
export const getAdminOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 10, status, userId } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const where: any = {};
    if (status) where.status = status;
    if (userId) where.userId = Number(userId);
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip: Number(skip),
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          items: {
            include: {
              Vendor: {
                select: {
                  businessName: true,
                },
              },
            },
          },
        },
      }),
      prisma.order.count({ where })
    ]);
    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Admin: Update order status
 */
export const updateAdminOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await prisma.order.findUnique({ where: { id: Number(id) } });
    if (!order) { res.status(404).json({ success: false, message: 'Order not found' }); return; }
    await prisma.order.update({ where: { id: order.id }, data: { status } });
    res.json({ success: true, message: 'Order status updated' });
  } catch (err) {
    next(err);
  }
};

/**
 * Admin: Order analytics
 */
export const getAdminOrderAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Count, total sales, status breakdown
    const [count, totalSales, statusCounts] = await Promise.all([
      prisma.order.count({}),
      prisma.order.aggregate({ _sum: { total: true }, where: { status: { not: 'CANCELLED' } } }),
      prisma.order.groupBy({ by: ['status'], _count: { _all: true } })
    ]);
    res.json({
      success: true,
      data: {
        totalOrders: count,
        totalSales: totalSales._sum.total || 0,
        statusBreakdown: statusCounts.map(s => ({ status: s.status, count: s._count._all }))
      }
    });
  } catch (err) {
    next(err);
  }
};