import { NepPayments } from 'neppayments';

// Helper to cast env to correct type
function getEnvMode(env: string | undefined): 'sandbox' | 'production' {
  return env === 'production' ? 'production' : 'sandbox';
}


export const payments = new NepPayments({
  khalti: {
    secretKey: process.env.KHALTI_SECRET_KEY || 'YOUR_KHALTI_SECRET_KEY',
    environment: getEnvMode(process.env.KHALTI_ENV)
  },
  esewa: {
    productCode: process.env.ESEWA_PRODUCT_CODE || 'EPAYTEST',
    secretKey: process.env.ESEWA_SECRET_KEY || '8gBm/:&EnhH.1/q',
    environment: getEnvMode(process.env.ESEWA_ENV),
    successUrl: '', // Will be set dynamically per request
    failureUrl: ''  // Will be set dynamically per request
  }
}); 