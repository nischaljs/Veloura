import prisma from '../utils/prisma';
import { Request, Response, NextFunction } from 'express';

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
            product: true
          }
        }
      }
    });
    if (!cart) {
      res.json({ success: true, data: { cart: { items: [] } } });
      return;
    }
    res.json({ success: true, data: { cart } });
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
    const { productId, quantity } = req.body;
    let cart = await prisma.cart.findUnique({ where: { userId }, include: { items: true } });
    if (!cart) {
      try {
        cart = await prisma.cart.create({ data: { userId } });
      } catch (err: any) {
        // If unique constraint error, fetch the existing cart
        if (err.code === 'P2002' || (err.message && err.message.includes('Unique constraint'))) {
          cart = await prisma.cart.findUnique({ where: { userId }, include: { items: true } });
        } else {
          throw err;
        }
      }
    }
    if (!cart) {
      res.status(500).json({ success: false, message: 'Cart could not be created or found.' });
      return;
    }
    // Check if item exists
    const existing = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });
    let cartItem;
    if (existing) {
      cartItem = await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
      });
    } else {
      cartItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: productId,
          quantity: quantity > 0 ? quantity : 1
        },
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
    if (!cart) { res.status(404).json({ success: false, message: 'Cart not found' }); return; }
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
    if (!cart) { res.status(404).json({ success: false, message: 'Cart not found' }); return; }
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
    if (!cart) { res.status(404).json({ success: false, message: 'Cart not found' }); return; }
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    res.json({ success: true, message: 'Cart cleared successfully' });
  } catch (err) {
    next(err);
  }
}; 