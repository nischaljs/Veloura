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
import { upload, handleUploadError } from '../middlewares/uploadMiddleware';

const router = Router();

// Public routes
router.get('/', getAllBrands);
router.get('/featured', getFeaturedBrands);
router.get('/search', searchBrands);
router.get('/analytics', authenticate, getBrandAnalytics);
router.get('/:slug', getBrandBySlug);
router.get('/:slug/products', getBrandProducts);

// Admin routes (require authentication)
router.post('/', authenticate, createBrand);
router.put('/:id', authenticate, updateBrand);
router.delete('/:id', authenticate, deleteBrand);

// Image upload routes
router.post('/:id/logo', authenticate, upload.single('logo'), handleUploadError, uploadBrandLogo);
router.delete('/:id/logo', authenticate, removeBrandLogo);

// Admin-only routes
router.put('/featured-order', authenticate, updateFeaturedOrder);

export default router; 