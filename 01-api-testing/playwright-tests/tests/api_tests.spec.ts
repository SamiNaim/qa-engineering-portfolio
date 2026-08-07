import { test, expect } from '@playwright/test';

test('API GET Request', async ({ request }) => {
  const response = await request.get('https://restful-booker.herokuapp.com/ping/');

  expect(response.status()).toBe(201);
});

test('API Response', async ({ request }) => {
  const response = await request.get('https://restful-booker.herokuapp.com/booking/2');
  const text = await response.text();

  expect(text).toContain('Breakfast');

  console.log(await response.json());
});