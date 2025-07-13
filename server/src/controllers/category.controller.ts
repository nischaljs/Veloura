import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { addImageUrls, addImageUrlsToArray } from '../utils/imageUtils';

// Helper function to create slug from name
const createSlug = (name: string): string => {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};

// GET /categories - Get all categories with pagination and filters
export const getAllCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 20, parent, featured, search } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    
    if (parent) {
      const parentCategory = await prisma.category.findUnique({
        where: { slug: parent as string }
      });
      if (parentCategory) {
        where.parentId = parentCategory.id;
      }
    } else if (parent === 'null') {
      where.parentId = null;
    }
    
    if (featured === 'true') {
      where.isFeatured = true;
    }
    
    if (search) {
      where.name = {
        contains: search as string
      };
    }

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: featured === 'true' ? { featuredOrder: 'asc' } : { name: 'asc' },
        include: {
          _count: {
            select: { 
              products: true,
              children: true
            }
          }
        }
      }),
      prisma.category.count({ where })
    ]);

    const categoriesWithCount = categories.map(category => ({
      ...category,
      productCount: (category as any)._count.products,
      subcategoryCount: (category as any)._count.children
    }));

    // Add complete image URLs
    const categoriesWithImageUrls = addImageUrlsToArray(categoriesWithCount, ['image']);

    res.json({
      success: true,
      data: {
        categories: categoriesWithImageUrls,
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

// GET /categories/:slug - Get category details by slug
export const getCategoryBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { 
            products: true,
            children: true
          }
        },
        parent: {
          select: { id: true, name: true, slug: true }
        },
        children: {
          include: {
            _count: {
              select: { products: true }
            }
          }
        }
      }
    });

    if (!category) {
      res.status(404).json({ success: false, message: 'Category not found' });
      return;
    }

    const subcategoriesWithCount = category.children.map(sub => ({
      id: sub.id,
      name: sub.name,
      slug: sub.slug,
      productCount: (sub as any)._count.products
    }));

    const categoryWithCount = {
      ...category,
      productCount: (category as any)._count.products,
      subcategoryCount: (category as any)._count.children,
      subcategories: subcategoriesWithCount
    };

    // Add complete image URLs
    const categoryWithImageUrl = addImageUrls(categoryWithCount, ['image']);

    res.json({
      success: true,
      data: {
        category: categoryWithImageUrl
      }
    });
    return;
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
    return;
  }
};

// GET /categories/:slug/products - Get products by category
export const getCategoryProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const { page = 1, limit = 20, sort, minPrice, maxPrice } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const category = await prisma.category.findUnique({ where: { slug } });
    if (!category) {
      res.status(404).json({ success: false, message: 'Category not found' });
      return;
    }

    const where: any = { categoryId: category.id };
    if (minPrice) where.price = { ...(where.price || {}), gte: parseFloat(minPrice as string) };
    if (maxPrice) where.price = { ...(where.price || {}), lte: parseFloat(maxPrice as string) };
    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price') orderBy = { price: 'asc' };
    if (sort === 'rating') orderBy = { rating: 'desc' };
    if (sort === 'newest') orderBy = { createdAt: 'desc' };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limitNum,
        orderBy,
        include: {
          images: true,
          category: { select: { name: true, slug: true } },
          brand: { select: { name: true, slug: true } }
        }
      }),
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
    return;
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
    return;
  }
};

// POST /categories - Create new category (admin only)
export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, parentId, isFeatured, featuredOrder } = req.body;
    
    if (!name) {
      res.status(400).json({ success: false, message: 'Category name is required' });
      return;
    }

    const slug = createSlug(name);
    
    const existingCategory = await prisma.category.findUnique({ where: { slug } });
    if (existingCategory) {
      res.status(409).json({ success: false, message: 'Category with this name already exists' });
      return;
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        parentId: parentId || null,
        isFeatured: isFeatured || false,
        featuredOrder: featuredOrder || null
      }
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: {
        category: {
          id: category.id,
          name: category.name,
          slug: category.slug
        }
      }
    });
    return;
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
    return;
  }
};

// PUT /categories/:id - Update category (admin only)
export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, parentId, isFeatured, featuredOrder } = req.body;

    const existingCategory = await prisma.category.findUnique({ where: { id: parseInt(id) } });
    if (!existingCategory) {
      res.status(404).json({ success: false, message: 'Category not found' });
      return;
    }

    const updateData: any = {};
    if (name !== undefined) {
      updateData.name = name;
      updateData.slug = createSlug(name);
    }
    if (description !== undefined) updateData.description = description;
    if (parentId !== undefined) updateData.parentId = parentId;
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured;
    if (featuredOrder !== undefined) updateData.featuredOrder = featuredOrder;

    await prisma.category.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    res.json({
      success: true,
      message: 'Category updated successfully'
    });
    return;
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
    return;
  }
};

// DELETE /categories/:id - Delete category (admin only)
export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const existingCategory = await prisma.category.findUnique({ where: { id: parseInt(id) } });
    if (!existingCategory) {
      res.status(404).json({ success: false, message: 'Category not found' });
      return;
    }

    await prisma.category.delete({ where: { id: parseInt(id) } });

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
    return;
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
    return;
  }
};

// POST /categories/:id/image - Upload category image (admin only)
export const uploadCategoryImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Check if category exists
    const existingCategory = await prisma.category.findUnique({ where: { id: parseInt(id) } });
    if (!existingCategory) {
      res.status(404).json({ success: false, message: 'Category not found' });
      return;
    }

    // Check if file was uploaded
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No image file provided' });
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      res.status(400).json({ 
        success: false, 
        message: 'Invalid file type. Only JPEG, PNG, and WebP files are allowed' 
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
    const filename = `category-${id}-image.${fileExtension}`;
    const imagePath = `/images/categories/${filename}`;

    // Update category with new image path
    await prisma.category.update({
      where: { id: parseInt(id) },
      data: { image: imagePath }
    });

    // Add complete image URL to response
    const imageUrl = addImageUrls({ image: imagePath }, ['image']);

    res.json({
      success: true,
      message: 'Category image uploaded successfully',
      data: {
        image: imageUrl.image
      }
    });
    return;
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
    return;
  }
};

// DELETE /categories/:id/image - Remove category image (admin only)
export const removeCategoryImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const existingCategory = await prisma.category.findUnique({ where: { id: parseInt(id) } });
    if (!existingCategory) {
      res.status(404).json({ success: false, message: 'Category not found' });
      return;
    }

    if (!existingCategory.image) {
      res.status(404).json({ success: false, message: 'Category has no image to remove' });
      return;
    }

    // Remove image from database
    await prisma.category.update({
      where: { id: parseInt(id) },
      data: { image: null }
    });

    res.json({
      success: true,
      message: 'Category image removed successfully'
    });
    return;
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
    return;
  }
};

// GET /categories/featured - Get featured categories
export const getFeaturedCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await prisma.category.findMany({
      where: { isFeatured: true },
      orderBy: { featuredOrder: 'asc' },
      include: {
        _count: {
          select: { 
            products: true,
            children: true
          }
        }
      }
    });

    const categoriesWithCount = categories.map(category => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      image: category.image,
      featuredOrder: category.featuredOrder,
      productCount: (category as any)._count.products
    }));

    // Add complete image URLs
    const categoriesWithImageUrls = addImageUrlsToArray(categoriesWithCount, ['image']);

    res.json({
      success: true,
      data: { categories: categoriesWithImageUrls }
    });
    return;
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
    return;
  }
};

// PUT /categories/featured-order - Update featured categories order (admin only)
export const updateFeaturedOrder = async (req: Request, res: Response): Promise<void> => {
  res.status(501).json({ success: false, message: 'Featured order update functionality yet to be implemented' });
  return;
};

// GET /categories/search - Search categories by name
export const searchCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q) {
      res.status(400).json({ success: false, message: 'Search query is required' });
      return;
    }

    const categories = await prisma.category.findMany({
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

    const categoriesWithCount = categories.map(category => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      image: category.image,
      productCount: (category as any)._count.products
    }));

    // Add complete image URLs
    const categoriesWithImageUrls = addImageUrlsToArray(categoriesWithCount, ['image']);

    res.json({
      success: true,
      data: { categories: categoriesWithImageUrls }
    });
    return;
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
    return;
  }
};

// GET /categories/tree - Get category hierarchy tree
export const getCategoryTree = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await prisma.category.findMany({
      where: { parentId: null },
      include: {
        _count: {
          select: { products: true }
        },
        children: {
          include: {
            _count: {
              select: { products: true }
            },
            children: {
              include: {
                _count: {
                  select: { products: true }
                }
              }
            }
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    const buildTree = (cats: any[]): any[] => {
      return cats.map(cat => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        productCount: (cat as any)._count.products,
        subcategories: buildTree(cat.children)
      }));
    };

    const categoryTree = buildTree(categories);

    res.json({
      success: true,
      data: { categories: categoryTree }
    });
    return;
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
    return;
  }
};

// GET /categories/analytics - Get category analytics (admin only)
export const getCategoryAnalytics = async (req: Request, res: Response): Promise<void> => {
  res.status(501).json({ success: false, message: 'Category analytics functionality yet to be implemented' });
  return;
}; 