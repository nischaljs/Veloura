import api from './api';

// Get all categories
export const getAllCategories = (params?: {
  page?: number;
  limit?: number;
  featured?: boolean;
}) => api.get('/categories', { params });

// Get featured categories
export const getFeaturedCategories = (limit?: number) => 
  api.get('/categories/featured', { params: { limit } });

// Get category tree
export const getCategoryTree = () => 
  api.get('/categories/tree');

// Get category by slug
export const getCategoryBySlug = (slug: string) => 
  api.get(`/categories/${slug}`);

// Get products by category
export const getCategoryProducts = (slug: string, params?: {
  page?: number;
  limit?: number;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
}) => api.get(`/categories/${slug}/products`, { params });

// Search categories
export const searchCategories = (query: string) => 
  api.get('/categories/search', { params: { q: query } });

// Legacy functions for backward compatibility
export async function fetchCategories(limit = 100) {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/categories?limit=${limit}`);
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}

export async function fetchCategoryTree() {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/categories/tree`);
  if (!res.ok) throw new Error('Failed to fetch category tree');
  return res.json();
}

export async function fetchCategoryBySlug(slug: string) {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/categories/${slug}`);
  if (!res.ok) throw new Error('Failed to fetch category');
  return res.json();
} 