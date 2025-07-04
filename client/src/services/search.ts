import api from './api';

export const searchProducts = (params: Record<string, any>) => {
  return api.get('/search', { params });
}; 