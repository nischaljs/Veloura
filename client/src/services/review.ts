import api from './api';

export const getVendorReviews = (params?: any) => api.get('/reviews/vendors/reviews', { params });