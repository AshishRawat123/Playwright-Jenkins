import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click(); 
  console.log('Login username : ',process.env.PLAYWRIGHT_username);
  console.log('password: ',process.env.password);

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});

test('Jenkins webhooks and build on push', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  console.log('Added this  test fo r Jenkins webhooks and build on push');

const secretFile = process.env.PLAYWRIGHT_SECRET_FILE;

console.log('Secret file exists:', !!secretFile);

if (!secretFile) {
  throw new Error('PLAYWRIGHT_SECRET_FILE is undefined');
}
});
