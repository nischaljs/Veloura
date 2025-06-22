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

const router = Router();

// Public routes
router.get('/', (req, res) => void getAllCategories(req, res));
router.get('/featured', (req, res) => void getFeaturedCategories(req, res));
router.get('/search', (req, res) => void searchCategories(req, res));
router.get('/tree', (req, res) => void getCategoryTree(req, res));
router.get('/:slug', (req, res) => void getCategoryBySlug(req, res));
router.get('/:slug/products', (req, res) => void getCategoryProducts(req, res));

// Admin routes (require admin authentication)
router.post('/', authenticateAdmin, (req, res) => void createCategory(req, res));
router.put('/:id', authenticateAdmin, (req, res) => void updateCategory(req, res));
router.delete('/:id', authenticateAdmin, (req, res) => void deleteCategory(req, res));
router.post('/:id/image', authenticateAdmin, (req, res) => void uploadCategoryImage(req, res));
router.delete('/:id/image', authenticateAdmin, (req, res) => void removeCategoryImage(req, res));
router.put('/featured-order', authenticateAdmin, (req, res) => void updateFeaturedOrder(req, res));
router.get('/analytics', authenticateAdmin, (req, res) => void getCategoryAnalytics(req, res));

export default router; 