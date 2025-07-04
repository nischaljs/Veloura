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