import api from './api';
import { Vendor, Product, DashboardStats } from '../types';

// Vendor Profile
export const getVendorProfile = () => api.get('/vendors/profile');

export const updateVendorProfile = (data: Partial<Vendor>) => api.put('/vendors/profile', data);

export const uploadLogo = (file: File) => {
  const formData = new FormData();
  formData.append('logo', file);
  return api.post('/vendors/logo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const uploadBanner = (file: File) => {
  const formData = new FormData();
  formData.append('banner', file);
  return api.post('/vendors/banner', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

// Public Vendor Data
export const getPublicVendorProfile = (slug: string) => api.get(`/vendors/${slug}`);

export const getVendorProducts = (slug: string, params?: {
  page?: number;
  limit?: number;
  category?: string;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
}) => api.get(`/vendors/${slug}/products`, { params });

export const getVendorReviews = (slug: string, params?: {
  page?: number;
  limit?: number;
}) => api.get(`/vendors/${slug}/reviews`, { params });

// Analytics
export const getVendorAnalytics = () => api.get('/vendors/analytics');

// Product Management (for logged-in vendor)
export const getMyProducts = () => api.get('/vendors/products');

export const addProduct = (data: any) => api.post('/vendors/products', data);

export const updateProduct = (id: number, data: any) => api.put(`/vendors/products/${id}`, data);

export const deleteProduct = (id: number) => api.delete(`/vendors/products/${id}`);

// Payouts
export const getPayoutRequests = () => api.get('/vendors/payout-requests');
export const createPayoutRequest = (amount: number) => api.post('/vendors/payout-requests', { amount }); 