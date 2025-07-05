import api from './api';

export const login = (identifier: string, password: string) =>
  api.post('/auth/login', { identifier, password });

export const register = (data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}) => api.post('/auth/register', data);

export const getCurrentUser = () => api.get('/auth/me');

export const logout = () => api.post('/auth/logout');

export const getProfile = () => api.get('/users/profile');

export const updateProfile = (data: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}) => api.put('/users/profile', data);

export const changePassword = (data: {
  currentPassword: string;
  newPassword: string;
}) => api.put('/users/password', data);

export const uploadAvatar = (formData: FormData) => 
  api.post('/users/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

export const deleteAvatar = () => api.delete('/users/avatar'); 