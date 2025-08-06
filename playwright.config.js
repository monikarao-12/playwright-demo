// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  use: {
    headless: false, // Set to false if you want to see the UI
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
