// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;

export default defineConfig({
  use: {
    headless: isCI, // ✅ Headless in CI, UI locally
  },

  reporter: [['html', { open: 'never' }]],

  projects: [
    // Desktop Browsers
    {
      name: 'Desktop Chromium',
      use: { browserName: 'chromium' },
    },
  ],
});
