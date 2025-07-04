import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { addImageUrls, addImageUrlsToArray } from '../utils/imageUtils';

// Helper to create slug from name
const createSlug = (name: string): string =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// GET /products - Get all products with filtering and pagination
export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = 1, limit = 12, category, brand, vendor,
      minPrice, maxPrice, rating, sort, order, status, featured, inStock
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (category) where.category = { slug: category };
    if (brand) where.brand = { slug: brand };
    if (vendor) where.vendor = { slug: vendor };
    if (status) where.status = status;
    if (featured === 'true') where.isFeatured = true;
    if (inStock === 'true') where.stockQuantity = { gt: 0 };
    if (minPrice) where.price = { ...(where.price || {}), gte: parseFloat(minPrice as string) };
    if (maxPrice) where.price = { ...(where.price || {}), lte: parseFloat(maxPrice as string) };
    if (rating) where.rating = { gte: parseFloat(rating as string) };

    let orderBy: any = {};
    if (sort) {
      if (sort === 'price' || sort === 'rating') orderBy[sort as string] = order === 'desc' ? 'desc' : 'asc';
      else if (sort === 'newest') orderBy['createdAt'] = 'desc';
      else if (sort === 'popularity') orderBy['reviewCount'] = 'desc';
    } else {
      orderBy = { createdAt: 'desc' };
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limitNum,
        orderBy,
        include: {
          vendor: { select: { id: true, businessName: true, slug: true } },
          category: { select: { id: true, name: true, slug: true } },
          brand: { select: { id: true, name: true, slug: true } },
          images: true,
        }
      }),
      prisma.product.count({ where })
    ]);

    // Map to add a single image field (primary or first) and complete URL, remove images array
    const productsWithImage = products.map(p => {
      const primaryImageObj = p.images && p.images.length > 0 ? (p.images.find(img => img.isPrimary) || p.images[0]) : null;
      const image = primaryImageObj ? addImageUrls(primaryImageObj, ['url']) : null;
      const { images, ...rest } = p; // Remove images array
      return {
        ...rest,
        image,
      };
    });

    // Filters for sidebar
    const [categories, brands, priceRange] = await Promise.all([
      prisma.category.findMany({
        select: { id: true, name: true, _count: { select: { products: true } } }
      }),
      prisma.brand.findMany({
        select: { id: true, name: true, _count: { select: { products: true } } }
      }),
      prisma.product.aggregate({
        _min: { price: true },
        _max: { price: true }
      })
    ]);

    res.json({
      success: true,
      data: {
        products: productsWithImage,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        },
        filters: {
          categories: categories.map(c => ({
            id: c.id, name: c.name, count: (c as any)._count.products
          })),
          brands: brands.map(b => ({
            id: b.id, name: b.name, count: (b as any)._count.products
          })),
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

// GET /products/:slug - Get product details by slug
export const getProductBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        vendor: { select: { id: true, businessName: true, slug: true, rating: true } },
        category: { select: { id: true, name: true, slug: true } },
        brand: { select: { id: true, name: true, slug: true } },
        images: true,
        variants: true,
        attributes: true,
        tags: true,
        reviews: true
      }
    });
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }
    // Add complete URLs to all images
    const productWithImageUrls = {
      ...product,
      images: addImageUrlsToArray(product.images, ['url'])
    };
    res.json({
      success: true,
      data: {
        product: addImageUrls(productWithImageUrls, ['image']),
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

// POST /products - Create new product (vendor auth required)
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name, description, shortDescription, price, salePrice, costPrice, sku,
      stockQuantity, categoryId, brandId, weight, length, width, height,
      hasVariants, attributes, tags
    } = req.body;

    if (!name || !price || !sku || !categoryId || !brandId) {
      res.status(400).json({ success: false, message: 'Missing required fields' });
      return;
    }

    const slug = createSlug(name);

    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) {
      res.status(409).json({ success: false, message: 'Product with this name already exists' });
      return;
    }

    // FIX: Look up vendor by userId
    const vendor = await prisma.vendor.findUnique({ where: { userId: (req as any).userId } });
    if (!vendor) {
      res.status(400).json({ success: false, message: 'Vendor profile not found for this user.' });
      return;
    }

    const product = await prisma.product.create({
      data: {
        name, slug, description, shortDescription, price: parseFloat(price),
        salePrice: salePrice ? parseFloat(salePrice) : null,
        costPrice: costPrice ? parseFloat(costPrice) : null,
        sku, stockQuantity: parseInt(stockQuantity),
        categoryId: parseInt(categoryId), brandId: parseInt(brandId),
        weight: weight ? parseFloat(weight) : null,
        length: length ? parseFloat(length) : null,
        width: width ? parseFloat(width) : null,
        height: height ? parseFloat(height) : null,
        hasVariants: !!hasVariants,
        attributes: attributes ? { create: attributes } : undefined,
        tags: tags ? { connectOrCreate: tags.map((t: string) => ({
          where: { name: t }, create: { name: t }
        })) } : undefined,
        vendorId: vendor.id
      }
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { product: { id: product.id, name: product.name, slug: product.slug, price: product.price } }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

// PUT /products/:id - Update product (vendor auth required)
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    if (updateData.name) updateData.slug = createSlug(updateData.name);

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    res.json({ success: true, message: 'Product updated successfully', data: { product } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

// DELETE /products/:id - Delete product (vendor auth required)
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id: parseInt(id) } });
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

// POST /products/:id/images - Upload product images (vendor auth required)
export const uploadProductImages = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const files = (req.files as Express.Multer.File[]) || [];
    if (!files.length) {
      res.status(400).json({ success: false, message: 'No images uploaded' });
      return;
    }
    const images = await Promise.all(files.map(file =>
      prisma.productImage.create({
        data: {
          productId: parseInt(id),
          url: `/images/products/${file.filename}`,
          altText: file.originalname,
          isPrimary: false,
          order: 0
        }
      })
    ));
    res.json({
      success: true,
      message: 'Images uploaded successfully',
      data: { images: addImageUrlsToArray(images, ['url']) }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

// PUT /products/:id/images/:imageId - Update product image (vendor auth required)
export const updateProductImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { imageId } = req.params;
    const { altText, isPrimary, order } = req.body;
    const image = await prisma.productImage.update({
      where: { id: parseInt(imageId) },
      data: { altText, isPrimary, order }
    });
    res.json({ success: true, message: 'Image updated successfully', data: { image: addImageUrls(image, ['url']) } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

// DELETE /products/:id/images/:imageId - Delete product image (vendor auth required)
export const deleteProductImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { imageId } = req.params;
    await prisma.productImage.delete({ where: { id: parseInt(imageId) } });
    res.json({ success: true, message: 'Image deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

// POST /products/:id/variants - Add product variant (vendor auth required)
export const addProductVariant = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, value, priceDifference, stockQuantity, sku, image } = req.body;
    const variant = await prisma.productVariant.create({
      data: {
        productId: parseInt(id),
        name, value,
        priceDifference: priceDifference ? parseFloat(priceDifference) : 0,
        stockQuantity: stockQuantity ? parseInt(stockQuantity) : 0,
        sku, image
      }
    });
    res.json({ success: true, message: 'Variant added successfully', data: { variant } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

// PUT /products/:id/variants/:variantId - Update product variant (vendor auth required)
export const updateProductVariant = async (req: Request, res: Response): Promise<void> => {
  try {
    const { variantId } = req.params;
    const updateData = { ...req.body };
    const variant = await prisma.productVariant.update({
      where: { id: parseInt(variantId) },
      data: updateData
    });
    res.json({ success: true, message: 'Variant updated successfully', data: { variant } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

// DELETE /products/:id/variants/:variantId - Delete product variant (vendor auth required)
export const deleteProductVariant = async (req: Request, res: Response): Promise<void> => {
  try {
    const { variantId } = req.params;
    await prisma.productVariant.delete({ where: { id: parseInt(variantId) } });
    res.json({ success: true, message: 'Variant deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

// GET /products/featured - Get featured products
export const getFeaturedProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { limit = 10 } = req.query;
    const products = await prisma.product.findMany({
      where: { isFeatured: true },
      take: parseInt(limit as string),
      orderBy: { createdAt: 'desc' }
    });
    res.json({
      success: true,
      data: { products: addImageUrlsToArray(products, ['image']) }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

// GET /products/trending - Get trending products
export const getTrendingProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { limit = 10, period } = req.query;
    // Trending = most sales in period
    // You must have an OrderItem or similar table for this to work
    const since = period === '30d'
      ? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      : period === '90d'
      ? new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
      : period === '7d'
      ? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      : undefined;

    let trendingProducts: any[] = [];
    if (since) {
      trendingProducts = await prisma.product.findMany({
        where: {
          orderItems: { some: { order: { createdAt: { gte: since } } } }
        },
        orderBy: [
          { orderItems: { _count: 'desc' } }
        ],
        take: parseInt(limit as string)
      });
    } else {
      trendingProducts = await prisma.product.findMany({
        orderBy: [
          { orderItems: { _count: 'desc' } }
        ],
        take: parseInt(limit as string)
      });
    }
    res.json({
      success: true,
      data: { products: addImageUrlsToArray(trendingProducts, ['image']) }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

// GET /products/similar/:productId - Get similar products
export const getSimilarProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;
    const { limit = 5 } = req.query;
    const product = await prisma.product.findUnique({ where: { id: parseInt(productId) } });
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }
    const similar = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id }
      },
      take: parseInt(limit as string)
    });
    res.json({
      success: true,
      data: { products: addImageUrlsToArray(similar, ['image']) }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

// POST /products/:id/stock - Update product stock (vendor auth required)
export const updateProductStock = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { stockQuantity, reason } = req.body;
    if (typeof stockQuantity !== 'number') {
      res.status(400).json({ success: false, message: 'stockQuantity must be a number' });
      return;
    }
    await prisma.product.update({
      where: { id: parseInt(id) },
      data: { stockQuantity }
    });
    res.json({ success: true, message: 'Stock updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

// GET /products/:id/analytics (vendor only)
export const getProductAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    // Aggregate order items for this product
    const orderItems = await prisma.orderItem.findMany({
      where: { productId: parseInt(id) },
      select: { orderId: true, price: true, salePrice: true, quantity: true }
    });
    const totalSales = orderItems.reduce((sum, item) => sum + ((item.salePrice ?? item.price) * item.quantity), 0);
    const uniqueOrderCount = new Set(orderItems.map(o => o.orderId)).size;
    const averageOrderValue = uniqueOrderCount ? totalSales / uniqueOrderCount : 0;
    // Average rating
    const reviews = await prisma.review.aggregate({
      where: { productId: parseInt(id) },
      _avg: { rating: true }
    });
    res.json({
      success: true,
      data: {
        analytics: {
          totalSales,
          totalOrders: uniqueOrderCount,
          averageOrderValue,
          totalViews: null, // Not tracked
          averageRating: reviews._avg.rating || 0
        }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
}; 