import api from './api';
import { User, Vendor, Product, DashboardStats } from '../types';

// User Management
export const getUsers = (params?: {
  page?: number;
  limit?: number;
  role?: string;
  status?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}) => api.get('/admin/users', { params });

export const getUserById = (id: number) => api.get(`/admin/users/${id}`);

export const updateUser = (id: number, data: Partial<User>) => api.put(`/admin/users/${id}`, data);

export const deleteUser = (id: number) => api.delete(`/admin/users/${id}`);

export const activateUser = (id: number) => api.put(`/admin/users/${id}/activate`);

export const deactivateUser = (id: number) => api.put(`/admin/users/${id}/deactivate`);

// Vendor Management
export const getVendors = (params?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}) => api.get('/admin/vendors', { params });

export const getVendorById = (id: number) => api.get(`/admin/vendors/${id}`);

export const approveVendor = (id: number) => api.put(`/admin/vendors/${id}/approve`);

export const rejectVendor = (id: number) => api.put(`/admin/vendors/${id}/reject`);

export const suspendVendor = (id: number) => api.put(`/admin/vendors/${id}/suspend`);

// Product Management
export const getProducts = (params?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  category?: string;
  vendor?: string;
}) => api.get('/admin/products', { params });

export const updateProductStatus = (id: number, status: string) => api.put(`/admin/products/${id}/status`, { status });

export const deleteProduct = (id: number) => api.delete(`/admin/products/${id}`);

// Order Management
export const getOrders = (params?: {
  page?: number;
  limit?: number;
  status?: string;
  paymentStatus?: string;
  vendor?: string;
  dateFrom?: string;
  dateTo?: string;
}) => api.get('/admin/orders', { params });

export const updateOrderStatus = (id: number, status: string) => api.put(`/admin/orders/${id}/status`, { status });

// Category Management
export const getCategories = (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => api.get('/admin/categories', { params });

export const createCategory = (data: { name: string; description?: string; parentId?: number }) => api.post('/admin/categories', data);

export const updateCategory = (id: number, data: { name?: string; description?: string; parentId?: number }) => api.put(`/admin/categories/${id}`, data);

export const deleteCategory = (id: number) => api.delete(`/admin/categories/${id}`);

// Brand Management
export const getBrands = (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => api.get('/admin/brands', { params });

export const createBrand = (data: { name: string; description?: string; website?: string; }) => api.post('/admin/brands', data);

export const updateBrand = (id: number, data: { name?: string; description?: string; website?: string; }) => api.put(`/admin/brands/${id}`, data);

export const deleteBrand = (id: number) => api.delete(`/admin/brands/${id}`);

// Coupon Management
export const getCoupons = (params?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}) => api.get('/admin/coupons', { params });

export const createCoupon = (data: any) => api.post('/admin/coupons', data);

export const deleteCoupon = (id: number) => api.delete(`/admin/coupons/${id}`);

// Analytics
export const getDashboardAnalytics = () => api.get('/admin/analytics/dashboard');

export const getUserAnalytics = () => api.get('/admin/analytics/users');

export const getVendorAnalytics = () => api.get('/admin/analytics/vendors');

export const getSalesAnalytics = () => api.get('/admin/analytics/sales');

// System Settings
export const getSettings = () => api.get('/admin/settings');

export const updateSettings = (data: any) => api.put('/admin/settings', data);

 