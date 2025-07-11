import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import slugify from 'slugify';
import path from 'path';
import { addImageUrls } from '../utils/imageUtils';

// Register as vendor
export const registerVendor = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { businessName, businessEmail, businessPhone, description, website, facebook, instagram, twitter } = req.body;
    const slug = slugify(businessName, { lower: true, strict: true });
    const vendor = await prisma.vendor.create({
      data: {
        userId,
        businessName,
        businessEmail,
        businessPhone,
        slug,
        description,
        website,
        facebook,
        instagram,
        twitter,
        isApproved: false
      }
    });
    res.json({ success: true, message: 'Vendor registration submitted for approval', data: { vendor } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

export const getVendorProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const vendor = await prisma.vendor.findFirst({ where: { userId: Number(userId) }, include: { products: true } });
    if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });
    const vendorWithUrls = addImageUrls(vendor, ['logo', 'banner']);
    res.json({ success: true, data: { vendor: vendorWithUrls } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

export const updateVendorProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { businessName, description, website, facebook, instagram, twitter } = req.body;
    const vendor = await prisma.vendor.update({
      where: { userId: Number(userId) },
      data: { businessName, description, website, facebook, instagram, twitter }
    });
    res.json({ success: true, message: 'Profile updated successfully', data: { vendor } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

export const uploadLogo = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    if (!req.file) { res.status(400).json({ success: false, message: 'No file uploaded' }); return; }
    const logoPath = '/images/brands/' + path.basename(req.file.path);
    const vendor = await prisma.vendor.update({ where: { userId: Number(userId) }, data: { logo: logoPath } });
    res.json({ success: true, message: 'Logo uploaded successfully', data: { logo: logoPath } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

export const uploadBanner = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    if (!req.file) { res.status(400).json({ success: false, message: 'No file uploaded' }); return; }
    const bannerPath = '/images/banners/' + path.basename(req.file.path);
    const vendor = await prisma.vendor.update({ where: { userId: Number(userId) }, data: { banner: bannerPath } });
    res.json({ success: true, message: 'Banner uploaded successfully', data: { banner: bannerPath } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

export const getPublicVendorProfile = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const vendor = await prisma.vendor.findUnique({ where: { slug } });
    if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });
    const vendorWithUrls = addImageUrls(vendor, ['logo', 'banner']);
    res.json({ success: true, data: { vendor: vendorWithUrls } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

export const getVendorProducts = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const { page = 1, limit = 12, category, sort, minPrice, maxPrice } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;
    const vendor = await prisma.vendor.findFirst({ where: { slug } });
    if (!vendor) { res.status(404).json({ success: false, message: 'Vendor not found' }); return; }
    const where: any = { vendorId: vendor.id };
    if (category) where.category = { slug: category };
    if (minPrice) where.price = { ...(where.price || {}), gte: parseFloat(minPrice as string) };
    if (maxPrice) where.price = { ...(where.price || {}), lte: parseFloat(maxPrice as string) };
    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price') orderBy = { price: 'asc' };
    if (sort === 'rating') orderBy = { rating: 'desc' };
    if (sort === 'newest') orderBy = { createdAt: 'desc' };
    const [products, total] = await Promise.all([
      prisma.product.findMany({ where, skip, take: limitNum, orderBy }),
      prisma.product.count({ where })
    ]);
    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

export const getVendorReviews = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const { page = 1, limit = 10, rating } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;
    const vendor = await prisma.vendor.findFirst({ where: { slug } });
    if (!vendor) { res.status(404).json({ success: false, message: 'Vendor not found' }); return; }
    const where: any = { vendorId: vendor.id };
    if (rating) where.rating = parseInt(rating as string);
    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { firstName: true, lastName: true } },
          product: { select: { name: true, slug: true } }
        }
      }),
      prisma.review.count({ where })
    ]);
    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

// Bank details
export const getBankDetails = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    console.log(`DEBUG: getBankDetails hit for userId: ${userId}`);
    res.json({ success: true, message: 'DEBUG: Bank details endpoint hit' });
  } catch (err) {
    console.error('❌ getBankDetails error:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};
export const addBankDetail = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    console.log(`Attempting to add bank detail for userId: ${userId}`);
    const vendor = await prisma.vendor.findFirst({ where: { userId: Number(userId) } });
    if (!vendor) { 
      console.log(`Vendor not found for userId: ${userId}`);
      res.status(404).json({ success: false, message: 'Vendor not found' }); return; }
    const data = { ...req.body, vendorId: vendor.id };
    const bankDetail = await prisma.bankDetail.create({ data });
    res.json({ success: true, message: 'Bank details added successfully', data: { bankDetail } });
  } catch (err) {
    console.error('❌ addBankDetail error:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};
export const updateBankDetail = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const id = Number(req.params.id);
    const vendor = await prisma.vendor.findFirst({ where: { userId: Number(userId) } });
    if (!vendor) { res.status(404).json({ success: false, message: 'Vendor not found' }); return; }
    const bankDetail = await prisma.bankDetail.update({ where: { id }, data: req.body });
    res.json({ success: true, message: 'Bank details updated successfully', data: { bankDetail } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};
export const deleteBankDetail = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const id = Number(req.params.id);
    const vendor = await prisma.vendor.findFirst({ where: { userId: Number(userId) } });
    if (!vendor) { res.status(404).json({ success: false, message: 'Vendor not found' }); return; }
    await prisma.bankDetail.delete({ where: { id } });
    res.json({ success: true, message: 'Bank details deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

// Policies
export const getPolicies = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const vendor = await prisma.vendor.findFirst({ where: { userId: Number(userId) } });
    if (!vendor) { res.status(404).json({ success: false, message: 'Vendor not found' }); return; }
    const policies = await prisma.vendorPolicy.findMany({ where: { vendorId: vendor.id } });
    res.json({ success: true, data: { policies } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};
export const addPolicy = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const vendor = await prisma.vendor.findFirst({ where: { userId: Number(userId) } });
    if (!vendor) { res.status(404).json({ success: false, message: 'Vendor not found' }); return; }
    const data = { ...req.body, vendorId: vendor.id };
    const policy = await prisma.vendorPolicy.create({ data });
    res.json({ success: true, message: 'Policy added successfully', data: { policy } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};
export const updatePolicy = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const id = Number(req.params.id);
    const vendor = await prisma.vendor.findFirst({ where: { userId: Number(userId) } });
    if (!vendor) { res.status(404).json({ success: false, message: 'Vendor not found' }); return; }
    const policy = await prisma.vendorPolicy.update({ where: { id }, data: req.body });
    res.json({ success: true, message: 'Policy updated successfully', data: { policy } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};
export const deletePolicy = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const id = Number(req.params.id);
    const vendor = await prisma.vendor.findFirst({ where: { userId: Number(userId) } });
    if (!vendor) { res.status(404).json({ success: false, message: 'Vendor not found' }); return; }
    await prisma.vendorPolicy.delete({ where: { id } });
    res.json({ success: true, message: 'Policy deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

// Analytics
export const getVendorAnalytics = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const vendor = await prisma.vendor.findFirst({ where: { userId: Number(userId) } });
    if (!vendor) { 
      res.status(404).json({ success: false, message: 'Vendor not found' }); 
      return; 
    }
    // Example analytics: total sales, orders, products, reviews, etc.
    const [totalSales, totalOrders, averageOrderValue, totalProducts, activeProducts, totalReviews, averageRating] = await Promise.all([
      prisma.order.aggregate({ _sum: { total: true }, where: { items: { some: { vendorId: vendor.id } } } }),
      prisma.order.count({ where: { items: { some: { vendorId: vendor.id } } } }),
      prisma.order.aggregate({ _avg: { total: true }, where: { items: { some: { vendorId: vendor.id } } } }),
      prisma.product.count({ where: { vendorId: vendor.id } }),
      prisma.product.count({ where: { vendorId: vendor.id, status: 'ACTIVE' } }),
      prisma.review.count({ where: { product: { vendorId: vendor.id } } }),
      prisma.review.aggregate({ _avg: { rating: true }, where: { product: { vendorId: vendor.id } } })
    ]);
    res.json({
      success: true,
      data: {
        analytics: {
          totalSales: totalSales._sum.total || 0,
          totalOrders,
          averageOrderValue: averageOrderValue._avg.total || 0,
          totalProducts,
          activeProducts,
          totalReviews,
          averageRating: averageRating._avg.rating || 0,
          salesChart: [] // You can add sales chart data here
        }
      }
    });
  } catch (err) {
    console.error('❌ getVendorAnalytics error:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

// Product Management (for logged-in vendor)
export const getMyProducts = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const vendor = await prisma.vendor.findFirst({ where: { userId: Number(userId) } });
    if (!vendor) { res.status(404).json({ success: false, message: 'Vendor not found' }); return; }
    
    const products = await prisma.product.findMany({
      where: { vendorId: vendor.id },
      orderBy: { createdAt: 'desc' },
      include: {
        category: { select: { name: true } },
        brand: { select: { name: true } },
        images: { select: { url: true, altText: true, isPrimary: true, order: true } },
        tags: { select: { name: true } },
        attributes: { select: { name: true, value: true } },
      }
    });

    const productsWithUrls = products.map(product => {
      const productImagesWithUrls = product.images.map(image => addImageUrls(image, ['url']));
      return { ...product, images: productImagesWithUrls };
    });
    
    res.json({ success: true, data: { products: productsWithUrls } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

export const addProduct = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const vendor = await prisma.vendor.findFirst({ where: { userId: Number(userId) } });
    if (!vendor) { res.status(404).json({ success: false, message: 'Vendor not found' }); return; }
    
    const { 
      name, description, shortDescription, price, salePrice, costPrice, sku, 
      stockQuantity, status = 'ACTIVE', isFeatured = false, hasVariants = false, 
      categoryId, brandId, weight, length, width, height,
      images = [], // Default to empty array
      tags = [],   // Default to empty array
      attributes = [] // Default to empty array
    } = req.body;
    const slug = slugify(name, { lower: true, strict: true });
    
    const product = await prisma.product.create({
      data: {
        name,
        description,
        shortDescription,
        price: parseFloat(price),
        salePrice: salePrice !== '' ? parseFloat(salePrice) : undefined,
        costPrice: costPrice !== '' ? parseFloat(costPrice) : undefined,
        sku,
        stockQuantity: parseInt(stockQuantity),
        status,
        isFeatured,
        hasVariants,
        weight: weight !== '' ? parseFloat(weight) : undefined,
        length: length !== '' ? parseFloat(length) : undefined,
        width: width !== '' ? parseFloat(width) : undefined,
        height: height !== '' ? parseFloat(height) : undefined,
        slug,
        vendorId: vendor.id,
        categoryId: parseInt(categoryId),
        brandId: brandId !== '' ? parseInt(brandId) : undefined,
        images: {
          create: images.map((image: { url: string; altText?: string; isPrimary?: boolean; order?: number; }) => ({
            url: image.url.replace(/^(http|https):\/\/[^\/]+\/images\//, '/images/'), // Strip base URL
            altText: image.altText,
            isPrimary: image.isPrimary,
            order: image.order
          }))
        },
        tags: {
          create: tags.map((tag: string) => ({ name: tag }))
        },
        attributes: {
          create: attributes.map((attr: { name: string; value: string; }) => ({
            name: attr.name,
            value: attr.value
          }))
        }
      }
    });
    
    res.json({ success: true, message: 'Product added successfully', data: { product } });
  } catch (err: any) {
    console.error('❌ addProduct error:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const productId = parseInt(req.params.id);
    const vendor = await prisma.vendor.findFirst({ where: { userId: Number(userId) } });
    if (!vendor) { res.status(404).json({ success: false, message: 'Vendor not found' }); return; }
    
    // Check if product belongs to this vendor
    const existingProduct = await prisma.product.findFirst({
      where: { id: productId, vendorId: vendor.id }
    });
    if (!existingProduct) { res.status(404).json({ success: false, message: 'Product not found' }); return; }
    
    const { name, description, price, stockQuantity, status } = req.body;
    const updateData: any = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price) updateData.price = parseFloat(price);
    if (stockQuantity !== undefined) updateData.stockQuantity = parseInt(stockQuantity);
    if (status) updateData.status = status;
    
    const product = await prisma.product.update({
      where: { id: productId },
      data: updateData
    });
    
    res.json({ success: true, message: 'Product updated successfully', data: { product } });
  } catch (err: any) {
    console.error('❌ updateProduct error:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const productId = parseInt(req.params.id);
    console.log(`Attempting to delete product ${productId} for user ${userId}`);

    const vendor = await prisma.vendor.findFirst({ where: { userId: Number(userId) } });
    if (!vendor) { 
      console.log(`Vendor not found for userId: ${userId}`);
      res.status(404).json({ success: false, message: 'Vendor not found' }); 
      return; 
    }
    console.log(`Vendor found: ${vendor.id}`);

    // Check if product belongs to this vendor
    const existingProduct = await prisma.product.findFirst({
      where: { id: productId, vendorId: vendor.id }
    });
    if (!existingProduct) { 
      console.log(`Product ${productId} not found or does not belong to vendor ${vendor.id}`);
      res.status(404).json({ success: false, message: 'Product not found' }); 
      return; 
    }
    console.log(`Existing product found: ${existingProduct.id}`);
    
    await prisma.product.delete({ where: { id: productId } });
    console.log(`Product ${productId} deleted successfully.`);
    
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (err: any) {
    console.error('❌ deleteProduct error:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};