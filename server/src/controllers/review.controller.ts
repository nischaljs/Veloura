import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';

// --- USER/PRODUCT REVIEWS ---
export const createReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId;
    const { productId, orderItemId, rating, title, comment, images } = req.body;
    // Check if user already reviewed this order item
    const existing = await prisma.review.findFirst({ where: { userId, orderItemId } });
    if (existing) { res.status(400).json({ success: false, message: 'You have already reviewed this item.' });
    return;
  }
    // Create review
    const review = await prisma.review.create({
      data: {
        userId,
        productId,
        orderItemId,
        rating,
        title,
        comment,
        images: images ? images : undefined,
        isApproved: true // auto-approve for now
      }
    });
    res.json({ success: true, message: 'Review submitted successfully', data: { review } });
  } catch (err) {
    next(err);
  }
};

export const getProductReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10, rating, sort } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const where: any = { productId: Number(productId), isApproved: true };
    if (rating) where.rating = Number(rating);
    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'oldest') orderBy = { createdAt: 'asc' };
    else if (sort === 'rating') orderBy = { rating: 'desc' };
    const [reviews, total, summary] = await Promise.all([
      prisma.review.findMany({
        where,
        skip: Number(skip),
        take: Number(limit),
        orderBy,
        include: { user: true, orderItem: { include: { variant: true } } }
      }),
      prisma.review.count({ where }),
      prisma.review.aggregate({
        where,
        _avg: { rating: true },
        _count: { rating: true }
      })
    ]);
    // Rating distribution
    const dist = await prisma.review.groupBy({
      by: ['rating'],
      where,
      _count: { _all: true }
    });
    res.json({
      success: true,
      data: {
        reviews: reviews.map(r => ({
          id: r.id,
          rating: r.rating,
          title: r.title,
          comment: r.comment,
          images: r.images,
          createdAt: r.createdAt,
          user: r.user ? { firstName: r.user.firstName, lastName: r.user.lastName } : undefined,
          variant: r.orderItem && r.orderItem.variant ? `${r.orderItem.variant.name}, ${r.orderItem.variant.value}` : undefined
        })),
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        },
        summary: {
          averageRating: summary._avg.rating || 0,
          totalReviews: summary._count.rating,
          ratingDistribution: dist.reduce((acc: Record<string, number>, d) => { acc[String(d.rating)] = d._count._all; return acc; }, {})
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getUserReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId;
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { userId },
        skip: Number(skip),
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: { product: { include: { images: true } }, orderItem: { include: { variant: true } } }
      }),
      prisma.review.count({ where: { userId } })
    ]);
    res.json({
      success: true,
      data: {
        reviews: reviews.map(r => ({
          id: r.id,
          rating: r.rating,
          title: r.title,
          comment: r.comment,
          images: r.images,
          isApproved: r.isApproved,
          createdAt: r.createdAt,
          product: {
            id: r.product.id,
            name: r.product.name,
            slug: r.product.slug,
            image: r.product.images && r.product.images.length > 0 ? r.product.images[0].url : null
          },
          orderItem: {
            variant: r.orderItem && r.orderItem.variant ? `${r.orderItem.variant.name}, ${r.orderItem.variant.value}` : undefined
          }
        })),
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

export const updateReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;
    const { rating, title, comment, images } = req.body;
    const review = await prisma.review.findUnique({ where: { id: Number(id) } });
    if (!review || review.userId !== userId) { res.status(404).json({ success: false, message: 'Review not found' });
    return;
  }
    await prisma.review.update({
      where: { id: Number(id) },
      data: { rating, title, comment, images }
    });
    res.json({ success: true, message: 'Review updated successfully' });
  } catch (err) {
    next(err);
  }
};

export const deleteReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;
    const review = await prisma.review.findUnique({ where: { id: Number(id) } });
    if (!review || review.userId !== userId) { res.status(404).json({ success: false, message: 'Review not found' });
    return;
  }
    await prisma.review.delete({ where: { id: Number(id) } });
    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (err) {
    next(err);
  }
};

export const uploadReviewImages = async (req: Request, res: Response, next: NextFunction) => {
  // Stub: In production, handle file upload and update review.images
  res.json({ success: true, message: 'Review images uploaded successfully', data: { images: [] } });
};

export const getProductReviewSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;
    const [summary, dist, recent] = await Promise.all([
      prisma.review.aggregate({
        where: { productId: Number(productId), isApproved: true },
        _avg: { rating: true },
        _count: { rating: true }
      }),
      prisma.review.groupBy({
        by: ['rating'],
        where: { productId: Number(productId), isApproved: true },
        _count: { _all: true }
      }),
      prisma.review.findMany({
        where: { productId: Number(productId), isApproved: true },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { user: true }
      })
    ]);
    res.json({
      success: true,
      data: {
        summary: {
          averageRating: summary._avg.rating || 0,
          totalReviews: summary._count.rating,
          ratingDistribution: dist.reduce((acc: Record<string, number>, d) => { acc[String(d.rating)] = d._count._all; return acc; }, {}),
          recentReviews: recent.map(r => ({
            id: r.id,
            rating: r.rating,
            title: r.title,
            user: r.user ? { firstName: r.user.firstName, lastName: r.user.lastName } : undefined,
            createdAt: r.createdAt
          }))
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

// --- HELPFULNESS (stub, as not in schema) ---
export const markHelpful = async (req: Request, res: Response, next: NextFunction) => {
  res.json({ success: true, message: 'Review marked as helpful' });
};
export const markUnhelpful = async (req: Request, res: Response, next: NextFunction) => {
  res.json({ success: true, message: 'Review marked as unhelpful' });
};
export const getHelpfulnessStats = async (req: Request, res: Response, next: NextFunction) => {
  res.json({ success: true, data: { helpfulCount: 0, unhelpfulCount: 0, userVote: null } });
};

// --- VENDOR REVIEWS ---
export const getVendorReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const vendorId = (req as any).vendorId;
    const { page = 1, limit = 10, rating, productId } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const where: any = { product: { vendorId } };
    if (rating) where.rating = Number(rating);
    if (productId) where.productId = Number(productId);
    const [reviews, total, summary] = await Promise.all([
      prisma.review.findMany({
        where,
        skip: Number(skip),
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: { user: true, product: true }
      }),
      prisma.review.count({ where }),
      prisma.review.aggregate({
        where,
        _avg: { rating: true },
        _count: { rating: true }
      })
    ]);
    const dist = await prisma.review.groupBy({
      by: ['rating'],
      where,
      _count: { _all: true }
    });
    res.json({
      success: true,
      data: {
        reviews: reviews.map(r => ({
          id: r.id,
          rating: r.rating,
          title: r.title,
          comment: r.comment,
          images: r.images,
          isApproved: r.isApproved,
          createdAt: r.createdAt,
          user: r.user ? { firstName: r.user.firstName, lastName: r.user.lastName } : undefined,
          product: { id: r.product.id, name: r.product.name, slug: r.product.slug }
        })),
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        },
        summary: {
          averageRating: summary._avg.rating || 0,
          totalReviews: summary._count.rating,
          ratingDistribution: dist.reduce((acc: Record<string, number>, d) => { acc[String(d.rating)] = d._count._all; return acc; }, {})
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getVendorReviewAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const vendorId = (req as any).vendorId;
    // Period param can be used for date filtering (not implemented here)
    const [count, avg, recent] = await Promise.all([
      prisma.review.count({ where: { product: { vendorId } } }),
      prisma.review.aggregate({ where: { product: { vendorId } }, _avg: { rating: true } }),
      prisma.review.count({ where: { product: { vendorId }, createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } })
    ]);
    res.json({
      success: true,
      data: {
        analytics: {
          totalReviews: count,
          averageRating: avg._avg.rating || 0,
          recentReviews: recent,
          ratingTrend: [], // Not implemented
          topProducts: []  // Not implemented
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

// --- ADMIN REVIEWS ---
export const getAdminReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 20, status, rating, vendor, product } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const where: any = {};
    if (status) where.isApproved = status === 'approved' ? true : status === 'pending' ? false : undefined;
    if (rating) where.rating = Number(rating);
    if (product) where.product = { slug: product };
    if (vendor) where.product = { ...where.product, vendor: { businessName: vendor } };
    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        skip: Number(skip),
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: { user: true, product: { include: { vendor: true } } }
      }),
      prisma.review.count({ where })
    ]);
    res.json({
      success: true,
      data: {
        reviews: reviews.map(r => ({
          id: r.id,
          rating: r.rating,
          title: r.title,
          comment: r.comment,
          images: r.images,
          isApproved: r.isApproved,
          createdAt: r.createdAt,
          user: { firstName: r.user.firstName, lastName: r.user.lastName, email: r.user.email },
          product: { name: r.product.name, slug: r.product.slug },
          vendor: { businessName: r.product.vendor.businessName }
        })),
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

export const approveReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await prisma.review.update({ where: { id: Number(id) }, data: { isApproved: true } });
    res.json({ success: true, message: 'Review approved successfully' });
  } catch (err) {
    next(err);
  }
};

export const rejectReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await prisma.review.update({ where: { id: Number(id) }, data: { isApproved: false } });
    res.json({ success: true, message: 'Review rejected successfully' });
  } catch (err) {
    next(err);
  }
};

export const deleteReviewAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await prisma.review.delete({ where: { id: Number(id) } });
    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (err) {
    next(err);
  }
};

export const getAdminReviewAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Not fully implemented: just return counts and averages
    const [count, avg] = await Promise.all([
      prisma.review.count({}),
      prisma.review.aggregate({ _avg: { rating: true } })
    ]);
    res.json({
      success: true,
      data: {
        analytics: {
          totalReviews: count,
          averageRating: avg._avg.rating || 0,
          pendingReviews: 0, // Not implemented
          approvedReviews: 0, // Not implemented
          rejectedReviews: 0, // Not implemented
          ratingDistribution: {},
          topVendors: [],
          topProducts: [],
          dailyReviews: []
        }
      }
    });
  } catch (err) {
    next(err);
  }
}; 