import api from './api';

export const getProductBySlug = (slug: string) => {
  return api.get(`/products/${slug}`);
}; 