// @ts-check
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: 5 * 60 * 1000,
  reporter: [
    ['html'],
    ['@applitools/eyes-playwright/reporter']
  ],
  use: {
    trace: 'on-first-retry',
    eyesConfig: {
      apiKey: process.env.APPLITOOLS_API_KEY,
      type: 'ufg',
      failTestsOnDiff: false,
      batch: { name: 'MCP Demo Tests', notifyOnCompletion: true },
      dontCloseBatches: false,
      logConfig: {
        type: 'file',
        filename: 'applitools.log',
      },
      browsersInfo: [
        { name: 'chrome', width: 1200, height: 800 },
        { name: 'firefox', width: 1200, height: 800 },
        { name: 'safari', width: 1200, height: 800 },
        { name: 'edgechromium', width: 1200, height: 800 },
        { chromeEmulationInfo: { deviceName: 'Galaxy S22 Ultra', screenOrientation: 'landscape' } }
      ],
    },
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});

