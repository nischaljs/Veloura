import api from './api';

export const getAddresses = () => api.get('/users/addresses');

export const addAddress = (data: {
  recipientName: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phone: string;
  isDefault: boolean;
}) => api.post('/users/addresses', data);

export const updateAddress = (id: number, data: {
  recipientName: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phone: string;
  isDefault: boolean;
}) => api.put(`/users/addresses/${id}`, data);

export const deleteAddress = (id: number) => api.delete(`/users/addresses/${id}`);

export const setDefaultAddress = (id: number) => api.put(`/users/addresses/${id}/default`);

export const getUserDashboardAnalytics = () => api.get('/users/analytics/dashboard');

export const getUserProfile = () => api.get('/users/profile');

export const updateUserProfile = (data: any) => api.put('/users/profile', data); 