import { faker } from '@faker-js/faker';

/**
 * Test data builders.
 *
 * Anything that must be unique is generated per-call rather than derived from
 * `Date.now()`: tests run in parallel across workers *and* across browser
 * projects, so a timestamp can collide and fail on a duplicate-value error.
 */

export const shipping = {
  firstName: 'Jane',
  lastName: 'Doe',
  postalCode: '12345',
} as const;

export const products = {
  backpack: 'sauce-labs-backpack',
  bikeLight: 'sauce-labs-bike-light',
} as const;

export const productNames = {
  backpack: 'Sauce Labs Backpack',
  bikeLight: 'Sauce Labs Bike Light',
} as const;

export function uniqueUser() {
  const id = faker.string.alphanumeric(10).toLowerCase();
  return {
    name: faker.person.firstName(),
    email: `qa_${id}@example.com`,
  };
}

export function practiceFormData() {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email({ provider: 'example.com' }).toLowerCase(),
    mobile: faker.string.numeric(10),
  };
}
