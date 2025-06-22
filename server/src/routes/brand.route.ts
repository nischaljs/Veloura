import { Router } from 'express';
import {
  getAllBrands,
  getBrandBySlug,
  getBrandProducts,
  createBrand,
  updateBrand,
  deleteBrand,
  uploadBrandLogo,
  removeBrandLogo,
  getFeaturedBrands,
  updateFeaturedOrder,
  searchBrands,
  getBrandAnalytics
} from '../controllers/brand.controller';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

// Public routes
router.get('/', getAllBrands);
router.get('/featured', getFeaturedBrands);
router.get('/search', searchBrands);
router.get('/:slug', getBrandBySlug);
router.get('/:slug/products', getBrandProducts);

// Admin routes (require authentication)
router.post('/', authenticate, createBrand);
router.put('/:id', authenticate, updateBrand);
router.delete('/:id', authenticate, deleteBrand);
router.post('/:id/logo', authenticate, uploadBrandLogo);
router.delete('/:id/logo', authenticate, removeBrandLogo);
router.put('/featured-order', authenticate, updateFeaturedOrder);
router.get('/analytics', authenticate, getBrandAnalytics);

export default router; 