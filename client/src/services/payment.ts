import api from './api';

export const initiateKhaltiPayment = (orderId: number, returnUrl: string, cancelUrl: string) =>
  api.post('/payments/khalti/initiate', { orderId, returnUrl, cancelUrl });
export const verifyKhaltiPayment = (pidx: string) =>
  api.post('/payments/khalti/verify', { pidx });

export const initiateEsewaPayment = (orderId: number, returnUrl: string, cancelUrl: string) =>
  api.post('/payments/esewa/initiate', { orderId, returnUrl, cancelUrl });
export const verifyEsewaPayment = (token: string, refId: string) =>
  api.post('/payments/esewa/verify', { token, refId });

export const confirmCODPayment = (orderId: number) =>
  api.post('/payments/cod/confirm', { orderId });

export const getPaymentOptions = () => api.get('/settings/payment-options'); 