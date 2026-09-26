export type CouponPayload = {
  code: string;
  amount: string;
  discount_type: 'percent' | 'fixed_cart' | 'fixed_product';
  description: string;
};

// Generates a coupon with a unique code, so tests never collide with existing coupons
export function buildCoupon(overrides: Partial<CouponPayload> = {}): CouponPayload {
  const uniqueSuffix = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  return {
    code: `Ganhe10-${uniqueSuffix}`,
    amount: '10.00',
    discount_type: 'fixed_product',
    description: 'Cupom de teste',
    ...overrides,
  };
}