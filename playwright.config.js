// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;

export default defineConfig({
  timeout: 90_000, // ✅ Allow slower CI runs globally

  use: {
    headless: isCI, // ✅ Headless in CI, headed locally
    video: isCI ? 'on' : 'retain-on-failure', // 🎥 Video in CI for debugging
    screenshot: 'only-on-failure', // 📸 Capture only when needed
    trace: isCI ? 'on-first-retry' : 'retain-on-failure', // 🧵 Tracing in CI
    actionTimeout: 30_000, // ⏳ Per-action timeout
    navigationTimeout: 45_000, // ⏳ Navigation wait time
    launchOptions: {
      slowMo: isCI ? 200 : 0, // 🐌 Slow mode for CI to stabilize iframe loads
    },
  },

  reporter: [
    ['html', { open: 'never' }],
    ['list'], // Log progress in CI
  ],

  projects: [
    {
      name: 'Desktop Chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  retries: isCI ? 1 : 0, // 🔁 Retry once in CI for flakiness
});
