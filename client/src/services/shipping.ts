import api from './api';

export const getShippingOptions = () => api.get('/shipping/options');
export const calculateShipping = (shippingOptionId: number, address: any) =>
  api.post('/shipping/calculate', { shippingOptionId, address });
export const getShippingZones = () => api.get('/shipping/zones');
export const getTrackingInfo = (trackingNumber: string) =>
  api.get(`/shipping/tracking/${trackingNumber}`); 