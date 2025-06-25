import { Router } from 'express';
import * as searchController from '../controllers/search.controller';
import { authenticate, authenticateAdmin } from '../middlewares/authMiddleware';

const router = Router();

// Product search and filter endpoints
router.get('/', searchController.searchProducts);
router.get('/suggestions', searchController.getSuggestions);
router.get('/autocomplete', searchController.getAutocomplete);
router.get('/filters', searchController.getFilters);
router.get('/trending', searchController.getTrending);
router.get('/popular', searchController.getPopular);
router.get('/recent', authenticate, searchController.getRecent);
router.post('/log', searchController.logSearch);
router.get('/analytics', authenticateAdmin, searchController.getAnalytics);
router.get('/advanced', searchController.advancedSearch);
router.get('/similar/:productId', searchController.getSimilarProducts);

export default router; 