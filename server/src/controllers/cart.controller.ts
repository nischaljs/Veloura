import prisma from '../utils/prisma';
import { Request, Response, NextFunction } from 'express';
import { calculateShippingFee, calculateTaxAmount, calculateDiscountAmount } from '../utils/cartUtils';

/**
 * Get the authenticated user's cart
 */
export const getCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId;
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: { vendor: true }
            },
            variant: true
          }
        }
      }
    });
    if (!cart) {
      res.json({ success: true, data: { cart: { items: [], summary: { subtotal: 0, shippingFee: 0, taxAmount: 0, discountAmount: 0, total: 0, itemCount: 0 } } } });
      return;
    }
    const subtotal = cart.items.reduce((sum: number, item: any) => {
      const price = item.variant?.priceDifference
        ? (item.product.salePrice ?? item.product.price) + item.variant.priceDifference
        : (item.product.salePrice ?? item.product.price);
      return sum + price * item.quantity;
    }, 0);
    const itemCount = cart.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
    const shippingFee = calculateShippingFee();
    const taxAmount = calculateTaxAmount(subtotal);
    const discountAmount = await calculateDiscountAmount(subtotal, (cart as any).couponCode);
    const total = subtotal + shippingFee + taxAmount - discountAmount;
    res.json({
      success: true,
      data: {
        cart: {
          items: cart.items,
          summary: {
            subtotal,
            shippingFee,
            taxAmount,
            discountAmount,
            total,
            itemCount
          }
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Add item to cart
 */
export const addToCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId;
    const { productId, variantId, quantity } = req.body;
    let cart = await prisma.cart.findUnique({ where: { userId }, include: { items: { include: { product: true, variant: true } } } });
    if (!cart) {
      await prisma.cart.create({ data: { userId } });
      cart = await prisma.cart.findUnique({ where: { userId }, include: { items: { include: { product: true, variant: true } } } });
    }
    if (!cart) {
      res.status(500).json({ success: false, message: 'Cart could not be created.' });
      return;
    }
    // Check if item exists
    const existing = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId, variantId: variantId ?? undefined },
    });
    let cartItem;
    if (existing) {
      cartItem = await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
      });
    } else {
      cartItem = await prisma.cartItem.create({
        data: { cartId: cart.id, productId, variantId, quantity },
      });
    }
    res.json({ success: true, message: 'Item added to cart successfully', data: { cartItem } });
  } catch (err) {
    next(err);
  }
};

/**
 * Update cart item quantity
 */
export const updateCartItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId;
    const { itemId } = req.params;
    const { quantity } = req.body;
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) { res.status(404).json({ success: false, message: 'Cart not found' });
    return;
    }
    const cartItem = await prisma.cartItem.update({
      where: { id: Number(itemId) },
      data: { quantity },
    });
    res.json({ success: true, message: 'Cart item updated successfully', data: { cartItem } });
  } catch (err) {
    next(err);
  }
};

/**
 * Remove item from cart
 */
export const removeCartItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId;
    const { itemId } = req.params;
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      res.status(404).json({ success: false, message: 'Cart not found' });
      return;
    }
    await prisma.cartItem.delete({ where: { id: Number(itemId) } });
    res.json({ success: true, message: 'Item removed from cart successfully' });
  } catch (err) {
    next(err);
  }
};

/**
 * Clear cart
 */
export const clearCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId;
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) { res.status(404).json({ success: false, message: 'Cart not found' });
    return;}
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    res.json({ success: true, message: 'Cart cleared successfully' });
  } catch (err) {
    next(err);
  }
};

/**
 * Get cart analytics
 */
export const getCartAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId;
    const cart = await prisma.cart.findUnique({ where: { userId }, include: { items: { include: { product: true, variant: true } } } });
    if (!cart) { res.json({ success: true, data: { analytics: { totalItems: 0, totalValue: 0, averageItemValue: 0 } } });
    return;}
    const totalItems = cart.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
    const totalValue = cart.items.reduce((sum: number, item: any) => {
      const price = item.variant?.priceDifference
        ? (item.product.salePrice ?? item.product.price) + item.variant.priceDifference
        : (item.product.salePrice ?? item.product.price);
      return sum + price * item.quantity;
    }, 0);
    const averageItemValue = totalItems ? +(totalValue / totalItems).toFixed(2) : 0;
    res.json({ success: true, data: { analytics: { totalItems, totalValue, averageItemValue } } });
  } catch (err) {
    next(err);
  }
};

// Guest Cart Controllers

/**
 * Get guest cart (session-based)
 */
export const getGuestCart = async (req: Request, res: Response, next: NextFunction) => {
  // TODO: Implement get guest cart logic
  res.json({ success: true, data: { cart: {} } });
};

/**
 * Add item to guest cart
 */
export const addToGuestCart = async (req: Request, res: Response, next: NextFunction) => {
  // TODO: Implement add to guest cart logic
  res.json({ success: true, message: 'Item added to cart successfully' });
};

/**
 * Merge guest cart with user cart
 */
export const mergeGuestCart = async (req: Request, res: Response, next: NextFunction) => {
  // TODO: Implement merge guest cart logic
  res.json({ success: true, message: 'Cart merged successfully', data: { mergedItems: 0, totalItems: 0 } });
};

export const applyCoupon = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId;
    const { code } = req.body;
    const coupon = await prisma.coupon.findUnique({ where: { code } });
    if (!coupon || !coupon.isActive) {
      res.status(400).json({ success: false, message: 'Invalid or inactive coupon' });
      return;
    }
    let cart = await prisma.cart.findUnique({ where: { userId }, include: { items: { include: { product: true, variant: true } } } });
    if (!cart) {
      await prisma.cart.create({ data: { userId } });
      cart = await prisma.cart.findUnique({ where: { userId }, include: { items: { include: { product: true, variant: true } } } });
    }
    if (!cart) {
      res.status(500).json({ success: false, message: 'Cart could not be created.' });
      return;
    }
    // No longer update cart with couponCode, just use code for calculations
    const subtotal = cart.items.reduce((sum: number, item: any) => {
      const price = item.variant?.priceDifference
        ? (item.product.salePrice ?? item.product.price) + item.variant.priceDifference
        : (item.product.salePrice ?? item.product.price);
      return sum + price * item.quantity;
    }, 0);
    const shippingFee = calculateShippingFee();
    const taxAmount = calculateTaxAmount(subtotal);
    const discountAmount = await calculateDiscountAmount(subtotal, code);
    const total = subtotal + shippingFee + taxAmount - discountAmount;
    res.json({
      success: true,
      message: 'Coupon applied successfully',
      data: {
        coupon: {
          code: coupon.code,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
          discountAmount
        },
        summary: {
          subtotal,
          shippingFee,
          taxAmount,
          discountAmount,
          total
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

export const removeCoupon = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // No longer update cart with couponCode, just respond success
    res.json({ success: true, message: 'Coupon removed successfully' });
  } catch (err) {
    next(err);
  }
};

export const getShippingOptions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Return some static options for now
    res.json({
      success: true,
      data: {
        shippingOptions: [
          { id: 1, name: 'Standard Delivery', description: '3-5 business days', fee: 100, estimatedDays: '3-5' },
          { id: 2, name: 'Express Delivery', description: '1-2 business days', fee: 200, estimatedDays: '1-2' }
        ]
      }
    });
  } catch (err) {
    next(err);
  }
};

export const calculateShipping = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId;
    const { shippingOptionId, address } = req.body;
    const cart = await prisma.cart.findUnique({ where: { userId }, include: { items: { include: { product: true, variant: true } } } });
    if (!cart) { res.status(404).json({ success: false, message: 'Cart not found' });
    return;
  }
    const subtotal = cart.items.reduce((sum: number, item: any) => {
      const price = item.variant?.priceDifference
        ? (item.product.salePrice ?? item.product.price) + item.variant.priceDifference
        : (item.product.salePrice ?? item.product.price);
      return sum + price * item.quantity;
    }, 0);
    const shippingFee = calculateShippingFee();
    const taxAmount = calculateTaxAmount(subtotal);
    const discountAmount = await calculateDiscountAmount(subtotal, (cart as any).couponCode);
    const total = subtotal + shippingFee + taxAmount - discountAmount;
    res.json({
      success: true,
      data: {
        shippingFee,
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        summary: {
          subtotal,
          shippingFee,
          taxAmount,
          discountAmount,
          total
        }
      }
    });
  } catch (err) {
    next(err);
  }
}; 