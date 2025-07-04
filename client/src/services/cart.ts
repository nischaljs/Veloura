import api from './api';

export const addToCart = ({ productId, variantId, quantity = 1 }: { productId: number | string, variantId?: number | string, quantity?: number }) => {
  return api.post('/cart/add', { productId, variantId, quantity });
};

export const getCart = () => {
  return api.get('/cart');
};

export const updateCartItem = (itemId: number | string, quantity: number) => {
  return api.put(`/cart/${itemId}`, { quantity });
};

export const removeCartItem = (itemId: number | string) => {
  return api.delete(`/cart/${itemId}`);
};

export const clearCart = () => {
  return api.delete('/cart');
};

export const applyCoupon = (code: string) => {
  return api.post('/cart/apply-coupon', { code });
};

export const removeCoupon = () => {
  return api.delete('/cart/coupon');
}; 