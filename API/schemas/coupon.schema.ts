import Joi from 'joi';

const nullableNumber = Joi.number().allow(null);
const money = Joi.string().pattern(/^\d+\.\d{2}$/); // e.g. "10.00"

export const couponSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  code: Joi.string().required(),
  amount: money.required(),
  discount_type: Joi.string().valid('percent', 'fixed_cart', 'fixed_product').required(),
  description: Joi.string().allow('').required(),
  date_created: Joi.string().isoDate().required(),
  date_modified: Joi.string().isoDate().required(),
  date_expires: Joi.string().isoDate().allow(null).required(),
  usage_count: Joi.number().integer().min(0).required(),
  individual_use: Joi.boolean().required(),
  product_ids: Joi.array().items(Joi.number()).required(),
  excluded_product_ids: Joi.array().items(Joi.number()).required(),
  usage_limit: nullableNumber.required(),
  usage_limit_per_user: nullableNumber.required(),
  limit_usage_to_x_items: nullableNumber.required(),
  free_shipping: Joi.boolean().required(),
  exclude_sale_items: Joi.boolean().required(),
  minimum_amount: money.required(),
  maximum_amount: money.required(),
  email_restrictions: Joi.array().items(Joi.string()).required(),
}).unknown(true);

export const couponListSchema = Joi.array().items(couponSchema);

export const errorSchema = Joi.object({
  code: Joi.string().required(),
  message: Joi.string().required(),
  data: Joi.object({ status: Joi.number().required() }).required(),
});