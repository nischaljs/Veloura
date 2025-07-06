import { Router } from 'express';
import {
  getAllProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  updateProductImage,
  deleteProductImage,
  addProductVariant,
  updateProductVariant,
  deleteProductVariant,
  getFeaturedProducts,
  getTrendingProducts,
  getSimilarProducts,
  updateProductStock,
  getProductAnalytics
} from '../controllers/product.controller';
import { authenticateVendor } from '../middlewares/authMiddleware';
import { upload, handleUploadError } from '../middlewares/uploadMiddleware';

const router = Router();

// Public routes
router.get('/', getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/trending', getTrendingProducts);
router.get('/similar/:productId', getSimilarProducts);
router.get('/:id/analytics', authenticateVendor, getProductAnalytics);
router.get('/:slug', getProductBySlug);

// Vendor-only routes
router.post('/', authenticateVendor, createProduct);
router.put('/:id', authenticateVendor, updateProduct);
router.delete('/:id', authenticateVendor, deleteProduct);

router.post('/:id/images', authenticateVendor, upload.array('images'), handleUploadError, uploadProductImages);
router.put('/:id/images/:imageId', authenticateVendor, updateProductImage);
router.delete('/:id/images/:imageId', authenticateVendor, deleteProductImage);

router.post('/:id/variants', authenticateVendor, addProductVariant);
router.put('/:id/variants/:variantId', authenticateVendor, updateProductVariant);
router.delete('/:id/variants/:variantId', authenticateVendor, deleteProductVariant);

router.post('/:id/stock', authenticateVendor, updateProductStock);

export default router; 