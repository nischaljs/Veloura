import api from './api';

export const addToCart = ({ productId, variantId, quantity = 1 }: { productId: number | string, variantId?: number | string, quantity?: number }) => {
  return api.post('/cart/add', { productId, variantId, quantity });
}; 