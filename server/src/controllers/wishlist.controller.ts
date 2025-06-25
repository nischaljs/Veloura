import prisma from '../utils/prisma';
import { Request, Response, NextFunction } from 'express';

/**
 * Get the authenticated user's wishlist
 */
export const getWishlist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId;
    const { page = 1, limit = 12 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const wishlist = await prisma.wishlist.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: { include: { vendor: true } } },
          skip,
          take: Number(limit),
        }
      }
    });
    const total = await prisma.wishlistItem.count({ where: { wishlistId: wishlist?.id } });
    res.json({
      success: true,
      data: {
        wishlist: wishlist?.items || [],
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
 * Add item to wishlist
 */
export const addToWishlist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId;
    const { productId } = req.body;
    let wishlist = await prisma.wishlist.findUnique({ where: { userId } });
    if (!wishlist) {
      wishlist = await prisma.wishlist.create({ data: { userId } });
    }
    // Check if item exists
    const existing = await prisma.wishlistItem.findFirst({ where: { wishlistId: wishlist.id, productId } });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Item already in wishlist' });
    }
    await prisma.wishlistItem.create({ data: { wishlistId: wishlist.id, productId } });
    res.json({ success: true, message: 'Item added to wishlist successfully' });
  } catch (err) {
    next(err);
  }
};

/**
 * Remove item from wishlist
 */
export const removeWishlistItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId;
    const { itemId } = req.params;
    const wishlist = await prisma.wishlist.findUnique({ where: { userId } });
    if (!wishlist) return res.status(404).json({ success: false, message: 'Wishlist not found' });
    await prisma.wishlistItem.delete({ where: { id: Number(itemId) } });
    res.json({ success: true, message: 'Item removed from wishlist successfully' });
  } catch (err) {
    next(err);
  }
};

/**
 * Clear wishlist
 */
export const clearWishlist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId;
    const wishlist = await prisma.wishlist.findUnique({ where: { userId } });
    if (!wishlist) return res.status(404).json({ success: false, message: 'Wishlist not found' });
    await prisma.wishlistItem.deleteMany({ where: { wishlistId: wishlist.id } });
    res.json({ success: true, message: 'Wishlist cleared successfully' });
  } catch (err) {
    next(err);
  }
};

/**
 * Move wishlist item to cart
 */
export const moveToCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId;
    const { itemId } = req.params;
    const { variantId, quantity = 1 } = req.body;
    const wishlist = await prisma.wishlist.findUnique({ where: { userId } });
    if (!wishlist) return res.status(404).json({ success: false, message: 'Wishlist not found' });
    const item = await prisma.wishlistItem.findUnique({ where: { id: Number(itemId) } });
    if (!item) return res.status(404).json({ success: false, message: 'Wishlist item not found' });
    // Add to cart
    let cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) cart = await prisma.cart.create({ data: { userId } });
    await prisma.cartItem.create({ data: { cartId: cart.id, productId: item.productId, variantId, quantity } });
    // Remove from wishlist
    await prisma.wishlistItem.delete({ where: { id: item.id } });
    res.json({ success: true, message: 'Item moved to cart successfully' });
  } catch (err) {
    next(err);
  }
};

/**
 * Move all wishlist items to cart
 */
export const moveAllToCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId;
    const wishlist = await prisma.wishlist.findUnique({ where: { userId }, include: { items: true } });
    if (!wishlist || wishlist.items.length === 0) return res.status(404).json({ success: false, message: 'Wishlist is empty' });
    let cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) cart = await prisma.cart.create({ data: { userId } });
    let movedItems = 0;
    for (const item of wishlist.items) {
      await prisma.cartItem.create({ data: { cartId: cart.id, productId: item.productId, quantity: 1 } });
      await prisma.wishlistItem.delete({ where: { id: item.id } });
      movedItems++;
    }
    res.json({ success: true, message: 'All items moved to cart successfully', data: { movedItems, failedItems: 0 } });
  } catch (err) {
    next(err);
  }
};

/**
 * Get wishlist analytics
 */
export const getWishlistAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId;
    const wishlist = await prisma.wishlist.findUnique({ where: { userId }, include: { items: { include: { product: true } } } });
    const totalItems = wishlist?.items.length || 0;
    const totalValue = wishlist?.items.reduce((sum: number, item: any) => sum + (item.product.salePrice ?? item.product.price), 0) || 0;
    const averageItemValue = totalItems ? +(totalValue / totalItems).toFixed(2) : 0;
    res.json({ success: true, data: { analytics: { totalItems, totalValue, averageItemValue } } });
  } catch (err) {
    next(err);
  }
}; 