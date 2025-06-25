import { Request, Response } from 'express';
import prisma from '../utils/prisma';

// GET /search
export const searchProducts = async (req: Request, res: Response) => {
  try {
    // Extract query params
    const {
      q, page = 1, limit = 12, category, brand, vendor, minPrice, maxPrice, rating, sort, order, inStock, featured, attributes, tags
    } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;
    // Build Prisma where clause
    const where: any = {};
    if (q) where.OR = [
      { name: { contains: q as string, mode: 'insensitive' } },
      { description: { contains: q as string, mode: 'insensitive' } }
    ];
    if (category) where.category = { slug: category };
    if (brand) where.brand = { slug: brand };
    if (vendor) where.vendor = { slug: vendor };
    if (featured === 'true') where.isFeatured = true;
    if (inStock === 'true') where.stockQuantity = { gt: 0 };
    if (minPrice) where.price = { ...(where.price || {}), gte: parseFloat(minPrice as string) };
    if (maxPrice) where.price = { ...(where.price || {}), lte: parseFloat(maxPrice as string) };
    if (rating) where.rating = { gte: parseFloat(rating as string) };
    if (tags) where.tags = { some: { name: { in: (tags as string).split(',') } } };
    // TODO: attributes filter
    // Sorting
    let orderBy: any = {};
    if (sort) {
      if (sort === 'price' || sort === 'rating') orderBy[sort as string] = order === 'desc' ? 'desc' : 'asc';
      else if (sort === 'newest') orderBy['createdAt'] = 'desc';
      else if (sort === 'popularity') orderBy['reviewCount'] = 'desc';
    } else {
      orderBy = { createdAt: 'desc' };
    }
    // Query products
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limitNum,
        orderBy,
        include: {
          vendor: { select: { businessName: true, slug: true } },
          category: { select: { name: true, slug: true } },
          brand: { select: { name: true, slug: true } },
          tags: true,
          attributes: true,
          images: true
        }
      }),
      prisma.product.count({ where })
    ]);
    // Format products
    const formatted = products.map(p => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      price: p.price,
      salePrice: p.salePrice,
      rating: p.rating,
      reviewCount: p.reviewCount,
      image: p.images?.[0]?.url || null,
      vendor: p.vendor,
      category: p.category,
      brand: p.brand,
      tags: p.tags?.map(t => t.name),
      attributes: Object.fromEntries((p.attributes || []).map(a => [a.name, a.value]))
    }));
    // TODO: filters, suggestions
    res.json({
      success: true,
      data: {
        query: q,
        products: formatted,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        },
        filters: {},
        suggestions: []
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

// GET /search/suggestions
export const getSuggestions = async (req: Request, res: Response) => {
  try {
    // TODO: Implement real suggestions
    res.json({ success: true, data: { suggestions: [] } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

// GET /search/autocomplete
export const getAutocomplete = async (req: Request, res: Response) => {
  try {
    // TODO: Implement real autocomplete
    res.json({ success: true, data: { products: [], categories: [], brands: [] } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

// GET /search/filters
export const getFilters = async (req: Request, res: Response) => {
  try {
    // TODO: Implement real filters
    res.json({ success: true, data: { filters: {} } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

// GET /search/trending
export const getTrending = async (req: Request, res: Response) => {
  try {
    // TODO: Implement trending search terms
    res.json({ success: true, data: { trending: [] } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

// GET /search/popular
export const getPopular = async (req: Request, res: Response) => {
  try {
    // TODO: Implement popular search terms
    res.json({ success: true, data: { popular: [] } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

// GET /search/recent
export const getRecent = async (req: Request, res: Response) => {
  try {
    // TODO: Implement recent search terms for user
    res.json({ success: true, data: { recent: [] } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

// POST /search/log
export const logSearch = async (req: Request, res: Response) => {
  try {
    // TODO: Implement search logging
    res.json({ success: true, message: 'Search logged successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

// GET /search/analytics
export const getAnalytics = async (req: Request, res: Response) => {
  try {
    // TODO: Implement search analytics
    res.json({ success: true, data: { analytics: {} } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

// GET /search/advanced
export const advancedSearch = async (req: Request, res: Response) => {
  try {
    // TODO: Implement advanced search
    res.json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

// GET /search/similar/:productId
export const getSimilarProducts = async (req: Request, res: Response) => {
  try {
    // TODO: Implement similar products
    res.json({ success: true, data: { similarProducts: [] } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
}; 