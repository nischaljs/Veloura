import prisma from './prisma';

export function calculateShippingFee(): number {
  // Random shipping fee between 50 and 200
  return Math.floor(Math.random() * 151) + 50;
}

export function calculateTaxAmount(subtotal: number): number {
  // 13% VAT
  return +(subtotal * 0.13).toFixed(2);
}

export async function calculateDiscountAmount(subtotal: number, couponCode?: string): Promise<number> {
  if (!couponCode) return 0;
  // The Coupon model is not defined in the Prisma schema, so this will always return 0.
  return 0;
}

export function calculateCartSummary(items: any[]): any {
  let subtotal = 0;
  let itemCount = 0;

  for (const item of items) {
    const price = item.product.salePrice || item.product.price;
    subtotal += price * item.quantity;
    itemCount += item.quantity;
  }

  const shippingFee = calculateShippingFee();
  const taxAmount = calculateTaxAmount(subtotal);
  // Discount amount is handled separately by applyCoupon/removeCoupon
  const discountAmount = 0; // Placeholder, actual discount comes from coupon application

  const total = subtotal + shippingFee + taxAmount - discountAmount;

  return {
    itemCount,
    subtotal: +subtotal.toFixed(2),
    shippingFee,
    taxAmount,
    discountAmount,
    total: +total.toFixed(2),
  };
}