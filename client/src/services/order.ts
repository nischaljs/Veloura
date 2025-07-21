import api from './api';

export const createOrder = (orderData: any) => api.post('/orders', orderData);
export const getOrders = (params?: any) => api.get('/users/orders', { params });
export const getOrder = (id: string | number) => api.get(`/orders/${id}`);
export const cancelOrder = (id: string | number, reason: string) => api.put(`/orders/${id}/cancel`, { reason });
export const returnOrder = (id: string | number, data: any) => api.post(`/orders/${id}/return`, data);
export const getOrderTracking = (id: string | number) => api.get(`/orders/${id}/tracking`);
export const getOrderInvoice = (id: string | number) => api.get(`/orders/invoice/${id}`);
export const getVendorOrders = (params?: any) => api.get('/orders/vendors/orders', { params });
export const getVendorOrderDetail = (id: string | number) => api.get(`/orders/vendors/orders/${id}`);
export const updateVendorOrderStatus = (orderId: number, status: string) =>
  api.put(`/orders/vendors/orders/${orderId}/status`, { status }); 