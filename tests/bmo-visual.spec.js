// @ts-check
import { test } from '@applitools/eyes-playwright/fixture';
import path from 'path';

test.use({
  browserName: 'chromium',
  viewport: { width: 1440, height: 900 },
  eyesConfig: {
    appName: 'AEO-Test',
    testName: 'AEO-Test Web',
    baselineEnvName: 'AEO-Test Web_1440',
    matchLevel: 'Strict',
    browsersInfo: [
      { name: 'chrome', width: 1440, height: 900 },
    ],
  },
});

const bmoURL = 'file://' + path.resolve('UI - Pages/BMO.html');

test('AEO-Test Web', async ({ page, eyes }) => {
  await page.goto(bmoURL);
  await eyes.check('AEO-Test Web');
});
