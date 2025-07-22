import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import slugify from 'slugify';
import path from 'path';
import { addImageUrls, addImageUrlsToArray } from '../utils/imageUtils';

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
    if (!vendor) { res.status(404).json({ success: false, message: 'Vendor not found' }); return; }
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
    const vendor = await prisma.vendor.findUnique({ where: { slug, isApproved: true } });
    if (!vendor) { res.status(404).json({ success: false, message: 'Vendor not found' }); return; }
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
    const vendor = await prisma.vendor.findFirst({ where: { slug, isApproved: true } });
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
      prisma.product.findMany({ where, skip, take: limitNum, orderBy, include: { images: true, category: true } }),
      prisma.product.count({ where })
    ]);
    // Add full URLs to all images in each product
    const productsWithImageUrls = products.map(product => ({
      ...product,
      images: addImageUrlsToArray(product.images, ['url'])
    }));
    res.json({
      success: true,
      data: {
        products: productsWithImageUrls,
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
      stockQuantity, status = 'ACTIVE', isFeatured = false,
      categoryId,
      tags = [],
      attributes = []
    } = req.body;
    const slug = slugify(name, { lower: true, strict: true });

    // Handle uploaded images
    const files = req.files as Express.Multer.File[];
    const imagesToCreate = files && files.length > 0
      ? files.map((file, idx) => ({
          url: `/images/products/${file.filename}`,
          altText: file.originalname,
          isPrimary: idx === 0, // First image is primary
          order: idx + 1
        }))
      : [];

    // Parse tags/attributes if sent as JSON string
    let tagsArr = tags;
    let attributesArr = attributes;
    if (typeof tags === 'string') {
      try { tagsArr = JSON.parse(tags); } catch {}
    }
    if (typeof attributes === 'string') {
      try { attributesArr = JSON.parse(attributes); } catch {}
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        shortDescription,
        price: price !== undefined && price !== '' ? parseFloat(price) : 0,
        salePrice: salePrice !== undefined && salePrice !== '' ? parseFloat(salePrice) : null,
        costPrice: costPrice !== undefined && costPrice !== '' ? parseFloat(costPrice) : null,
        sku,
        stockQuantity: stockQuantity !== undefined && stockQuantity !== '' ? parseInt(stockQuantity) : 0,
        status,
        isFeatured,
        slug,
        vendorId: vendor.id,
        categoryId: categoryId !== undefined && categoryId !== '' ? parseInt(categoryId) : undefined,
        images: {
          create: imagesToCreate
        },
        tags: {
          create: Array.isArray(tagsArr) ? tagsArr.map((tag: string) => ({ name: tag })) : []
        },
        attributes: {
          create: Array.isArray(attributesArr) ? attributesArr.map((attr: { name: string; value: string; }) => ({
            name: attr.name,
            value: attr.value
          })) : []
        }
      },
      include: {
        images: true,
        tags: true,
        attributes: true,
        category: true
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

// POST /vendors/payout-requests - Vendor requests payout
export const createPayoutRequest = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const vendor = await prisma.vendor.findFirst({ where: { userId: Number(userId) } });
    if (!vendor) {
      res.status(404).json({ success: false, message: 'Vendor not found' });
      return;
    }
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      res.status(400).json({ success: false, message: 'Invalid amount' });
      return;
    }

    // Calculate total earnings from delivered orders
    const totalEarned = await prisma.commission.aggregate({ where: { vendorId: vendor.id }, _sum: { amount: true } });

    // Sum of all completed payouts
    const totalPayouts = await prisma.payoutRequest.aggregate({
      where: {
        vendorId: vendor.id,
        status: 'COMPLETED'
      },
      _sum: {
        amount: true
      }
    });

    const availableBalance = (totalEarned._sum.amount?.toNumber() || 0) - (totalPayouts._sum.amount?.toNumber() || 0);

    if (amount > availableBalance) {
      res.status(400).json({ success: false, message: `Amount exceeds available balance. Available: ${availableBalance.toFixed(2)}` });
      return;
    }

    const payout = await prisma.payoutRequest.create({
      data: { vendorId: vendor.id, amount, status: 'PENDING' } // Payout request starts as PENDING
    });
    res.json({ success: true, message: 'Payout request submitted', data: { payout } });
  } catch (err: any) {
    console.error('❌ createPayoutRequest error:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// GET /vendors/payout-requests - Vendor views payout requests
export const getPayoutRequests = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const vendor = await prisma.vendor.findFirst({ where: { userId: Number(userId) } });
    if (!vendor) {
      res.status(404).json({ success: false, message: 'Vendor not found' });
      return;
    }
    const payouts = await prisma.payoutRequest.findMany({
      where: { vendorId: vendor.id },
      orderBy: { createdAt: 'desc' },
      include: {
        vendor: {
          select: {
            businessName: true
          }
        }
      }
    });
    res.json({ success: true, data: { payouts } });
  } catch (err: any) {
    console.error('❌ getPayoutRequests error:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};