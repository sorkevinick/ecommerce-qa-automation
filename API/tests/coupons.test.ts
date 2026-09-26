import request from 'supertest';
import { env } from '../utils/env';
import { expectToMatchSchema } from '../utils/schema';
import { buildCoupon, type CouponPayload } from '../data/couponFactory';
import { couponSchema, couponListSchema, errorSchema } from '../schemas/coupon.schema';

const api = request(env.baseUrl);
const createdCouponIds: number[] = [];

async function createCoupon(payload: Partial<CouponPayload>) {
  const response = await api
    .post('/coupons')
    .auth(env.apiUser, env.apiPassword)
    .send(payload);

  if (response.status === 201) createdCouponIds.push(response.body.id);
  return response;
}

describe('US-0003 – Coupons API', () => {
  let existingCoupon: { id: number; code: string };

  beforeAll(async () => {
    const response = await createCoupon(buildCoupon());
    expect(response.status).toBe(201);
    existingCoupon = response.body;
  });

  // Removes every coupon created by the tests, keeping the store clean
  afterAll(async () => {
    for (const id of createdCouponIds) {
      await api
        .delete(`/coupons/${id}`)
        .query({ force: true })
        .auth(env.apiUser, env.apiPassword);
    }
  });

  describe('GET /coupons', () => {
    test('TC-003-01 – should list coupons', async () => {
      const response = await api.get('/coupons').auth(env.apiUser, env.apiPassword);

      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThan(0);
      expectToMatchSchema(response.body, couponListSchema);
    });

    test('TC-003-02 – should retrieve a coupon by ID', async () => {
      const response = await api
        .get(`/coupons/${existingCoupon.id}`)
        .auth(env.apiUser, env.apiPassword);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(existingCoupon.id);
      expectToMatchSchema(response.body, couponSchema);
    });

    test('TC-003-03 – should return 404 for a non-existent coupon', async () => {
      const response = await api.get('/coupons/999999999').auth(env.apiUser, env.apiPassword);

      expect(response.status).toBe(404);
      expect(response.body.code).toBe('woocommerce_rest_shop_coupon_invalid_id');
      expectToMatchSchema(response.body, errorSchema);
    });

    test('TC-003-07 – should reject requests without authentication', async () => {
      const response = await api.get('/coupons');

      expect(response.status).toBe(401);
      expect(response.body.code).toBe('woocommerce_rest_cannot_view');
      expectToMatchSchema(response.body, errorSchema);
    });
  });

  describe('POST /coupons', () => {
    test('TC-003-04 – should create a coupon with all required fields', async () => {
      const payload = buildCoupon();

      const response = await createCoupon(payload);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        code: payload.code.toLowerCase(), // WooCommerce stores coupon codes in lowercase
        amount: payload.amount,
        discount_type: payload.discount_type,
        description: payload.description,
      });
      expectToMatchSchema(response.body, couponSchema);
    });

    test('TC-003-05 – should reject a duplicated coupon code', async () => {
      const response = await createCoupon(buildCoupon({ code: existingCoupon.code }));

      expect(response.status).toBe(400);
      expect(response.body.code).toBe('woocommerce_rest_coupon_code_already_exists');
      expectToMatchSchema(response.body, errorSchema);
    });

    test('TC-003-06 – should reject a coupon without "code"', async () => {
      const { code: _omitted, ...payload } = buildCoupon();

      const response = await createCoupon(payload);

      expect(response.status).toBe(400);
    });

    // BUG-003: the API accepts coupons without these required fields (returns 201).
    // Marked as expected failures until the fix; Jest warns when they start passing.
    test.failing.each(['amount', 'discount_type', 'description'] as const)(
      'TC-003-06 – should reject a coupon without "%s" [BUG-003]',
      async (field) => {
        const { [field]: _omitted, ...payload } = buildCoupon();

        const response = await createCoupon(payload);

        expect(response.status).toBe(400);
      },
    );
  });
});