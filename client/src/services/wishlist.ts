import api from './api';

export const addToWishlist = (productId: number | string) => {
  return api.post('/wishlist', { productId });
}; 