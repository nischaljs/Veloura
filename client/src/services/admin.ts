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

// Analytics
export const getDashboardAnalytics = () => api.get('/admin/analytics/dashboard');

export const getUserAnalytics = () => api.get('/admin/analytics/users');

export const getVendorAnalytics = () => api.get('/admin/analytics/vendors');

export const getSalesAnalytics = () => api.get('/admin/analytics/sales');

// System Settings
export const getSettings = () => api.get('/admin/settings');

export const updateSettings = (data: any) => api.put('/admin/settings', data);

// Activity Logs
export const getActivities = () => api.get('/admin/activities');

// Backup & Export
export const createBackup = () => api.post('/admin/backup/create');

export const getBackupList = () => api.get('/admin/backup/list');

export const exportUsers = () => api.post('/admin/export/users'); 