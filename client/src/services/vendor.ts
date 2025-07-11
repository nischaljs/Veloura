import api from './api';
import { Vendor, Product, BankDetail, VendorPolicy, DashboardStats } from '../types';

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
  rating?: number;
}) => api.get(`/vendors/${slug}/reviews`, { params });

// Bank Details
export const getBankDetails = () => api.get('/vendors/bank-details');

export const addBankDetail = (data: Omit<BankDetail, 'id' | 'vendorId'>) => api.post('/vendors/bank-details', data);

export const updateBankDetail = (id: number, data: Partial<BankDetail>) => api.put(`/vendors/bank-details/${id}`, data);

export const deleteBankDetail = (id: number) => api.delete(`/vendors/bank-details/${id}`);

// Policies
export const getPolicies = () => api.get('/vendors/policies');

export const addPolicy = (data: Omit<VendorPolicy, 'id' | 'vendorId'>) => api.post('/vendors/policies', data);

export const updatePolicy = (id: number, data: Partial<VendorPolicy>) => api.put(`/vendors/policies/${id}`, data);

export const deletePolicy = (id: number) => api.delete(`/vendors/policies/${id}`);

// Analytics
export const getVendorAnalytics = () => api.get('/vendors/analytics');

// Product Management (for logged-in vendor)
export const getMyProducts = () => api.get('/vendors/products');

export const addProduct = (data: any) => api.post('/vendors/products', data);

export const updateProduct = (id: number, data: any) => api.put(`/vendors/products/${id}`, data);

export const deleteProduct = (id: number) => api.delete(`/vendors/products/${id}`); 