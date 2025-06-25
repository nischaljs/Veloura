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
  const coupon = await prisma.coupon.findUnique({ where: { code: couponCode } });
  if (!coupon || !coupon.isActive) return 0;
  if (coupon.discountType === 'percentage') {
    return +(subtotal * (coupon.discountValue / 100)).toFixed(2);
  } else if (coupon.discountType === 'fixed') {
    return Math.min(subtotal, coupon.discountValue);
  }
  return 0;
} 