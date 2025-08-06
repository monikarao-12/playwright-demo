const { test, expect } = require('@playwright/test');

test('Sign in with valid credentials', async ({ page }) => {
  // Navigate to the login page
  await page.goto('https://cypress.apps.cspf.co/login/');

  // Fill in login credentials
  await page.fill('#user_login', 'tester12@gmail.com');
  await page.fill('#user_pass', '12345');

  // Submit the login form
  await page.click('#wp-submit');

  // Wait for redirect to the account page
  await page.waitForURL(url => url.href.includes('account'), { timeout: 15000 });

  // Assert welcome message is shown
  await expect(page.locator('body')).toContainText(/Welcome to cypress\.apps\.cspf\.co/i);
});
