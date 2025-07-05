import api from './api';

// Get all products with optional filters
export const getAllProducts = (params?: {
  page?: number;
  limit?: number;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  search?: string;
}) => api.get('/products', { params });

// Get featured products
export const getFeaturedProducts = (limit?: number) => 
  api.get('/products/featured', { params: { limit } });

// Get trending products
export const getTrendingProducts = (limit?: number) => 
  api.get('/products/trending', { params: { limit } });

// Get similar products
export const getSimilarProducts = (productId: string, limit?: number) => 
  api.get(`/products/similar/${productId}`, { params: { limit } });

// Get product by slug
export const getProductBySlug = (slug: string) => 
  api.get(`/products/${slug}`);

// Get products by category
export const getProductsByCategory = (categorySlug: string, params?: {
  page?: number;
  limit?: number;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
}) => api.get(`/categories/${categorySlug}/products`, { params });

// Get products by brand
export const getProductsByBrand = (brandSlug: string, params?: {
  page?: number;
  limit?: number;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
}) => api.get(`/brands/${brandSlug}/products`, { params }); 