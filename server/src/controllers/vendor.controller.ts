import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import slugify from 'slugify';
import path from 'path';

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
    const vendor = await prisma.vendor.findUnique({ where: { userId } });
    if (!vendor) { res.status(404).json({ success: false, message: 'Vendor not found' }); return; }
    res.json({ success: true, data: { vendor } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

export const updateVendorProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { businessName, description, website, facebook, instagram, twitter } = req.body;
    const vendor = await prisma.vendor.update({
      where: { userId },
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
    const vendor = await prisma.vendor.update({ where: { userId }, data: { logo: logoPath } });
    res.json({ success: true, message: 'Logo uploaded successfully', data: { logo: logoPath } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

export const uploadBanner = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    if (!req.file) { res.status(400).json({ success: false, message: 'No file uploaded' }); return; }
    const bannerPath = '/images/brands/' + path.basename(req.file.path);
    const vendor = await prisma.vendor.update({ where: { userId }, data: { banner: bannerPath } });
    res.json({ success: true, message: 'Banner uploaded successfully', data: { banner: bannerPath } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

export const getPublicVendorProfile = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const vendor = await prisma.vendor.findUnique({ where: { slug } });
    if (!vendor) { res.status(404).json({ success: false, message: 'Vendor not found' }); return; }
    res.json({ success: true, data: { vendor } });
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
    const vendor = await prisma.vendor.findUnique({ where: { slug } });
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
    const vendor = await prisma.vendor.findUnique({ where: { slug } });
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
    const vendor = await prisma.vendor.findUnique({ where: { userId } });
    if (!vendor) { res.status(404).json({ success: false, message: 'Vendor not found' }); return; }
    const bankDetails = await prisma.bankDetail.findMany({ where: { vendorId: vendor.id } });
    res.json({ success: true, data: { bankDetails } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};
export const addBankDetail = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const vendor = await prisma.vendor.findUnique({ where: { userId } });
    if (!vendor) { res.status(404).json({ success: false, message: 'Vendor not found' }); return; }
    const data = { ...req.body, vendorId: vendor.id };
    const bankDetail = await prisma.bankDetail.create({ data });
    res.json({ success: true, message: 'Bank details added successfully', data: { bankDetail } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};
export const updateBankDetail = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const id = Number(req.params.id);
    const vendor = await prisma.vendor.findUnique({ where: { userId } });
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
    const vendor = await prisma.vendor.findUnique({ where: { userId } });
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
    const vendor = await prisma.vendor.findUnique({ where: { userId } });
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
    const vendor = await prisma.vendor.findUnique({ where: { userId } });
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
    const vendor = await prisma.vendor.findUnique({ where: { userId } });
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
    const vendor = await prisma.vendor.findUnique({ where: { userId } });
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
    const vendor = await prisma.vendor.findUnique({ where: { userId } });
    if (!vendor) { res.status(404).json({ success: false, message: 'Vendor not found' }); return; }
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
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
}; 