// @ts-check
import { test } from '@applitools/eyes-playwright/fixture';
import path from 'path';

const welcomeURL = 'file://' + path.resolve('UI - Pages/welcome.html');

test('welcome page - visual check apr', async ({ page, eyes }) => {
  await page.goto(welcomeURL);
  await eyes.check('Welcome Page');
});
