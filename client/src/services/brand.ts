import api from './api';

// Get all brands
export const getAllBrands = (params?: {
  page?: number;
  limit?: number;
  featured?: boolean;
}) => api.get('/brands', { params });

// Get featured brands
export const getFeaturedBrands = (limit?: number) => 
  api.get('/brands/featured', { params: { limit } });

// Get brand by slug
export const getBrandBySlug = (slug: string) => 
  api.get(`/brands/${slug}`);

// Get products by brand
export const getBrandProducts = (slug: string, params?: {
  page?: number;
  limit?: number;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
}) => api.get(`/brands/${slug}/products`, { params });

// Search brands
export const searchBrands = (query: string) => 
  api.get('/brands/search', { params: { q: query } });

// Legacy functions for backward compatibility
export async function fetchBrands(limit = 100) {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/brands?limit=${limit}`);
  if (!res.ok) throw new Error('Failed to fetch brands');
  return res.json();
} 