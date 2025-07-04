import api from './api';

export const registerBusiness = (data: {
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  description?: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
}) => api.post('/vendors/register', data); 