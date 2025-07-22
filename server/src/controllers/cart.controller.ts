import prisma from '../utils/prisma';
import { Request, Response, NextFunction } from 'express';
import { calculateCartSummary } from '../utils/cartUtils';
import { addImageUrls, addImageUrlsToArray } from '../utils/imageUtils';

// Helper function to get cart with populated items and calculated summary
const getCartWithSummary = async (userId: number) => {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: true,
              vendor: true,
            },
          },
        },
      },
    },
  });

  if (!cart) {
    return null;
  }

  // Add full image URLs to each product and its images
  for (const item of cart.items) {
    if (item.product) {
      // Add image URLs to all images
      if (item.product.images && Array.isArray(item.product.images)) {
        item.product.images = addImageUrlsToArray(item.product.images, ['url']);
      }
      // Add image URLs to vendor logo if present
      if (item.product.vendor) {
        item.product.vendor = addImageUrls(item.product.vendor, ['logo']);
      }
    }
  }

  const summary = calculateCartSummary(cart.items);

  return { ...cart, summary };
};

/**
 * Get the authenticated user's cart
 */
export const getCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId;
    const cart = await getCartWithSummary(userId);
    if (!cart) {
      res.json({ success: true, data: { cart: { items: [], summary: { itemCount: 0, subtotal: 0, total: 0, shippingFee: 0, taxAmount: 0, discountAmount: 0 } } } });
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
        cart = await prisma.cart.create({ data: { userId, items: { create: [] } }, include: { items: true } });
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
    res.json({ success: true, message: 'Item added to cart successfully', data: { cart: await getCartWithSummary(userId) } });
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
    await prisma.cartItem.update({
      where: { id: Number(itemId) },
      data: { quantity },
    });
    const updatedCart = await getCartWithSummary(userId);
    res.json({ success: true, message: 'Cart item updated successfully', data: { cart: updatedCart } });
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
    const updatedCart = await getCartWithSummary(userId);
    res.json({ success: true, message: 'Item removed from cart successfully', data: { cart: updatedCart } });
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
    const updatedCart = await getCartWithSummary(userId);
    res.json({ success: true, message: 'Cart cleared successfully', data: { cart: updatedCart } });
  } catch (err) {
    next(err);
  }
};