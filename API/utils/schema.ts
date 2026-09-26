import type Joi from 'joi';

// Fails the test with a readable list of every contract violation found
export function expectToMatchSchema(body: unknown, schema: Joi.Schema) {
  const { error } = schema.validate(body, { abortEarly: false });
  expect(error?.message).toBeUndefined();
}