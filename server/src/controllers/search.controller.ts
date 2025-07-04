import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { addImageUrlsToArray } from '../utils/imageUtils';

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
      { name: { contains: q as string } },
      { description: { contains: q as string } }
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
          tags: { select: { name: true } },
          attributes: { select: { name: true, value: true } },
          images: true
        }
      }),
      prisma.product.count({ where })
    ]);
    // Format products
    const formatted = products.map(p => {
      const productImages = addImageUrlsToArray(p.images, ['url']);
      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        salePrice: p.salePrice,
        rating: p.rating,
        reviewCount: p.reviewCount,
        image: productImages.length > 0 ? productImages[0] : null,
        images: productImages,
        vendor: p.vendor,
        category: p.category,
        brand: p.brand,
        tags: p.tags,
        attributes: p.attributes,
      };
    });
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
    console.error('Search error:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

// GET /search/suggestions
export const getSuggestions = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    if (!q) return res.json({ success: true, data: { suggestions: [] } });
    const suggestions = await prisma.product.findMany({
      where: {
        name: { contains: q as string }
      },
      select: { name: true },
      take: 5
    });
    res.json({ success: true, data: { suggestions: suggestions.map(s => s.name) } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

// GET /search/autocomplete
export const getAutocomplete = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    if (!q) return res.json({ success: true, data: { products: [], categories: [], brands: [] } });
    const [products, categories, brands] = await Promise.all([
      prisma.product.findMany({ where: { name: { contains: q as string } }, select: { id: true, name: true, slug: true }, take: 5 }),
      prisma.category.findMany({ where: { name: { contains: q as string } }, select: { id: true, name: true, slug: true }, take: 5 }),
      prisma.brand.findMany({ where: { name: { contains: q as string } }, select: { id: true, name: true, slug: true }, take: 5 })
    ]);
    res.json({ success: true, data: { products, categories, brands } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

// GET /search/filters
export const getFilters = async (req: Request, res: Response) => {
  try {
    // Return all categories, brands, and price range
    const [categories, brands, priceRange] = await Promise.all([
      prisma.category.findMany({ select: { id: true, name: true, slug: true } }),
      prisma.brand.findMany({ select: { id: true, name: true, slug: true } }),
      prisma.product.aggregate({ _min: { price: true }, _max: { price: true } })
    ]);
    res.json({
      success: true,
      data: {
        filters: {
          categories,
          brands,
          priceRange: {
            min: priceRange._min.price || 0,
            max: priceRange._max.price || 0
          }
        }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

// GET /search/trending
export const getTrending = async (req: Request, res: Response) => {
  try {
    // Top 5 products with most reviews
    const trending = await prisma.product.findMany({
      orderBy: { reviewCount: 'desc' },
      take: 5,
      select: { id: true, name: true, slug: true, reviewCount: true }
    });
    res.json({ success: true, data: { trending } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

// GET /search/popular
export const getPopular = async (req: Request, res: Response) => {
  try {
    // Top 5 products with highest rating
    const popular = await prisma.product.findMany({
      orderBy: { rating: 'desc' },
      take: 5,
      select: { id: true, name: true, slug: true, rating: true }
    });
    res.json({ success: true, data: { popular } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

// GET /search/recent
export const getRecent = async (req: Request, res: Response) => {
  try {
    // Stub: would require user search history
    res.json({ success: true, data: { recent: [] } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

// POST /search/log
export const logSearch = async (req: Request, res: Response) => {
  try {
    // Stub: would require user search logging
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