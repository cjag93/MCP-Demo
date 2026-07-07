// @ts-check
import { test } from '@applitools/eyes-playwright/fixture';
import path from 'path';

const aeoURL = 'file://' + path.resolve('UI - Pages/aeo-login.html');

test('AEO Login Page', async ({ page, eyes }) => {
  await page.goto(aeoURL);
  await eyes.check('AEO Login Page');
});
