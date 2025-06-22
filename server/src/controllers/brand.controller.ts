import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { addImageUrls, addImageUrlsToArray } from '../utils/imageUtils';

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

    // Add complete image URLs
    const brandsWithImageUrls = addImageUrlsToArray(brandsWithCount, ['logo']);

    res.json({
      success: true,
      data: {
        brands: brandsWithImageUrls,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      }
    });
    return;
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
    return;
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

    const brandWithCount = {
      ...brand,
      productCount: (brand as any)._count.products
    };

    // Add complete image URL
    const brandWithImageUrl = addImageUrls(brandWithCount, ['logo']);

    res.json({
      success: true,
      data: {
        brand: brandWithImageUrl
      }
    });
    return;
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
    return;
  }
};

// GET /brands/:slug/products - Get products by brand
export const getBrandProducts = async (req: Request, res: Response): Promise<void> => {
  res.status(501).json({ success: false, message: 'Brand products functionality yet to be implemented' });
  return;
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
    return;
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
    return;
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
    return;
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
    return;
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
    return;
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
    return;
  }
};

// POST /brands/:id/logo - Upload brand logo (admin only)
export const uploadBrandLogo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Check if brand exists
    const existingBrand = await prisma.brand.findUnique({ where: { id: parseInt(id) } });
    if (!existingBrand) {
      res.status(404).json({ success: false, message: 'Brand not found' });
      return;
    }

    // Check if file was uploaded
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No image file provided' });
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      res.status(400).json({ 
        success: false, 
        message: 'Invalid file type. Only JPEG, PNG, WebP, and SVG files are allowed' 
      });
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (req.file.size > maxSize) {
      res.status(400).json({ 
        success: false, 
        message: 'File too large. Maximum size is 5MB' 
      });
      return;
    }

    // Generate filename
    const fileExtension = req.file.originalname.split('.').pop();
    const filename = `brand-${id}-logo.${fileExtension}`;
    const logoPath = `/images/brands/${filename}`;

    // Update brand with new logo path
    await prisma.brand.update({
      where: { id: parseInt(id) },
      data: { logo: logoPath }
    });

    // Add complete image URL to response
    const logoUrl = addImageUrls({ logo: logoPath }, ['logo']);

    res.json({
      success: true,
      message: 'Brand logo uploaded successfully',
      data: {
        logo: logoUrl.logo
      }
    });
    return;
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
    return;
  }
};

// DELETE /brands/:id/logo - Remove brand logo (admin only)
export const removeBrandLogo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const existingBrand = await prisma.brand.findUnique({ where: { id: parseInt(id) } });
    if (!existingBrand) {
      res.status(404).json({ success: false, message: 'Brand not found' });
      return;
    }

    if (!existingBrand.logo) {
      res.status(404).json({ success: false, message: 'Brand has no logo to remove' });
      return;
    }

    // Remove logo from database
    await prisma.brand.update({
      where: { id: parseInt(id) },
      data: { logo: null }
    });

    res.json({
      success: true,
      message: 'Brand logo removed successfully'
    });
    return;
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
    return;
  }
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

    // Add complete image URLs
    const brandsWithImageUrls = addImageUrlsToArray(brandsWithCount, ['logo']);

    res.json({
      success: true,
      data: { brands: brandsWithImageUrls }
    });
    return;
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
    return;
  }
};

// PUT /brands/featured-order - Update featured brands order (admin only)
export const updateFeaturedOrder = async (req: Request, res: Response): Promise<void> => {
  res.status(501).json({ success: false, message: 'Featured order update functionality yet to be implemented' });
  return;
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

    // Add complete image URLs
    const brandsWithImageUrls = addImageUrlsToArray(brandsWithCount, ['logo']);

    res.json({
      success: true,
      data: { brands: brandsWithImageUrls }
    });
    return;
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
    return;
  }
};

// GET /brands/analytics - Get brand analytics (admin only)
export const getBrandAnalytics = async (req: Request, res: Response): Promise<void> => {
  res.status(501).json({ success: false, message: 'Brand analytics functionality yet to be implemented' });
  return;
}; 