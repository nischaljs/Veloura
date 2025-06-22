import { Router } from 'express';
import {
  getAllCategories,
  getCategoryBySlug,
  getCategoryProducts,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  removeCategoryImage,
  getFeaturedCategories,
  updateFeaturedOrder,
  searchCategories,
  getCategoryTree,
  getCategoryAnalytics
} from '../controllers/category.controller';
import { authenticateAdmin } from '../middlewares/authMiddleware';
import { upload, handleUploadError } from '../middlewares/uploadMiddleware';

const router = Router();

// Public routes
router.get('/', getAllCategories);
router.get('/featured', getFeaturedCategories);
router.get('/search', searchCategories);
router.get('/tree', getCategoryTree);
router.get('/:slug', getCategoryBySlug);
router.get('/:slug/products', getCategoryProducts);

// Admin routes (require admin authentication)
router.post('/', authenticateAdmin, createCategory);
router.put('/:id', authenticateAdmin, updateCategory);
router.delete('/:id', authenticateAdmin, deleteCategory);

// Image upload routes
router.post('/:id/image', authenticateAdmin, upload.single('image'), handleUploadError, uploadCategoryImage);
router.delete('/:id/image', authenticateAdmin, removeCategoryImage);

// Admin-only routes
router.put('/featured-order', authenticateAdmin, updateFeaturedOrder);
router.get('/analytics', authenticateAdmin, getCategoryAnalytics);

export default router; 