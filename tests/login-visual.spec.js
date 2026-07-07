// @ts-check
import { test } from '@applitools/eyes-playwright/fixture';
import path from 'path';

test.use({ browserName: 'chromium' });

const loginURL = 'file://' + path.resolve('UI - Pages/login.html');

test('login page - Demo', async ({ page, eyes }) => {
  await page.goto(loginURL);
  await eyes.check('Login Page');
});
