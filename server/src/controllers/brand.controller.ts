import { Request, Response } from 'express';
import prisma from '../utils/prisma';

// Helper function to create slug from name
const createSlug = (name: string): string => {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};

// GET /brands - Get all brands with pagination and filters
export const getAllBrands = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 20, featured, search } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    
    if (featured === 'true') {
      where.isFeatured = true;
    }
    
    if (search) {
      where.name = {
        contains: search as string
      };
    }

    const [brands, total] = await Promise.all([
      prisma.brand.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: featured === 'true' ? { featuredOrder: 'asc' } : { name: 'asc' },
        include: {
          _count: {
            select: { products: true }
          }
        }
      }),
      prisma.brand.count({ where })
    ]);

    const brandsWithCount = brands.map(brand => ({
      ...brand,
      productCount: (brand as any)._count.products
    }));

    res.json({
      success: true,
      data: {
        brands: brandsWithCount,
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

// GET /brands/:slug - Get brand details by slug
export const getBrandBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    
    const brand = await prisma.brand.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    if (!brand) {
      res.status(404).json({ success: false, message: 'Brand not found' });
      return;
    }

    res.json({
      success: true,
      data: {
        brand: {
          ...brand,
          productCount: (brand as any)._count.products
        }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

// GET /brands/:slug/products - Get products by brand
export const getBrandProducts = async (req: Request, res: Response): Promise<void> => {
  res.status(501).json({ success: false, message: 'Brand products functionality yet to be implemented' });
};

// POST /brands - Create new brand (admin only)
export const createBrand = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, website, isFeatured, featuredOrder } = req.body;
    
    if (!name) {
      res.status(400).json({ success: false, message: 'Brand name is required' });
      return;
    }

    const slug = createSlug(name);
    
    const existingBrand = await prisma.brand.findUnique({ where: { slug } });
    if (existingBrand) {
      res.status(409).json({ success: false, message: 'Brand with this name already exists' });
      return;
    }

    const brand = await prisma.brand.create({
      data: {
        name,
        slug,
        description,
        website,
        isFeatured: isFeatured || false,
        featuredOrder: featuredOrder || null
      }
    });

    res.status(201).json({
      success: true,
      message: 'Brand created successfully',
      data: {
        brand: {
          id: brand.id,
          name: brand.name,
          slug: brand.slug
        }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

// PUT /brands/:id - Update brand (admin only)
export const updateBrand = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, website, isFeatured, featuredOrder } = req.body;

    const existingBrand = await prisma.brand.findUnique({ where: { id: parseInt(id) } });
    if (!existingBrand) {
      res.status(404).json({ success: false, message: 'Brand not found' });
      return;
    }

    const updateData: any = {};
    if (name !== undefined) {
      updateData.name = name;
      updateData.slug = createSlug(name);
    }
    if (description !== undefined) updateData.description = description;
    if (website !== undefined) updateData.website = website;
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured;
    if (featuredOrder !== undefined) updateData.featuredOrder = featuredOrder;

    await prisma.brand.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    res.json({
      success: true,
      message: 'Brand updated successfully'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

// DELETE /brands/:id - Delete brand (admin only)
export const deleteBrand = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const existingBrand = await prisma.brand.findUnique({ where: { id: parseInt(id) } });
    if (!existingBrand) {
      res.status(404).json({ success: false, message: 'Brand not found' });
      return;
    }

    await prisma.brand.delete({ where: { id: parseInt(id) } });

    res.json({
      success: true,
      message: 'Brand deleted successfully'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

// POST /brands/:id/logo - Upload brand logo (admin only)
export const uploadBrandLogo = async (req: Request, res: Response): Promise<void> => {
  res.status(501).json({ success: false, message: 'Logo upload functionality yet to be implemented' });
};

// DELETE /brands/:id/logo - Remove brand logo (admin only)
export const removeBrandLogo = async (req: Request, res: Response): Promise<void> => {
  res.status(501).json({ success: false, message: 'Logo removal functionality yet to be implemented' });
};

// GET /brands/featured - Get featured brands
export const getFeaturedBrands = async (req: Request, res: Response): Promise<void> => {
  try {
    const brands = await prisma.brand.findMany({
      where: { isFeatured: true },
      orderBy: { featuredOrder: 'asc' },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    const brandsWithCount = brands.map(brand => ({
      id: brand.id,
      name: brand.name,
      slug: brand.slug,
      logo: brand.logo,
      featuredOrder: brand.featuredOrder,
      productCount: (brand as any)._count.products
    }));

    res.json({
      success: true,
      data: { brands: brandsWithCount }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

// PUT /brands/featured-order - Update featured brands order (admin only)
export const updateFeaturedOrder = async (req: Request, res: Response): Promise<void> => {
  res.status(501).json({ success: false, message: 'Featured order update functionality yet to be implemented' });
};

// GET /brands/search - Search brands by name
export const searchBrands = async (req: Request, res: Response): Promise<void> => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q) {
      res.status(400).json({ success: false, message: 'Search query is required' });
      return;
    }

    const brands = await prisma.brand.findMany({
      where: {
        name: {
          contains: q as string
        }
      },
      take: parseInt(limit as string),
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    const brandsWithCount = brands.map(brand => ({
      id: brand.id,
      name: brand.name,
      slug: brand.slug,
      logo: brand.logo,
      productCount: (brand as any)._count.products
    }));

    res.json({
      success: true,
      data: { brands: brandsWithCount }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

// GET /brands/analytics - Get brand analytics (admin only)
export const getBrandAnalytics = async (req: Request, res: Response): Promise<void> => {
  res.status(501).json({ success: false, message: 'Brand analytics functionality yet to be implemented' });
}; 