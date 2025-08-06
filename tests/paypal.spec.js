const { test, expect } = require('@playwright/test');

test('sign up with PayPal payment', async ({ page }) => {
  // Navigate to the membership registration page
  await page.goto('https://cypress.apps.cspf.co/register/basic-membership/');

  // Generate a unique email using timestamp
  const timestamp = Date.now();
  const email = `test+${timestamp}@example.com`;

  // Fill out the registration form
  await page.fill('input[name="user_login"]', email);
  await page.fill('input[name="user_email"]', email);
  await page.fill('input[name="meco_user_password"]', 'password123');
  await page.fill('input[name="meco_user_password_confirm"]', 'password123');

  // Select PayPal as the payment method
  await page.click('.payment-option-paypal');

  // Submit the registration form
  await page.click('.meco-submit');

  // Fill in PayPal login credentials
  await page.fill('input[name="login_email"]', 'sb-46qed7959789@business.example.com');
  await page.click('#btnNext');

  await page.fill('input[name="login_password"]', 'Dlq3)0*)');
  await page.click('#btnLogin');

  // Submit the PayPal payment
  await page.click('[data-id="payment-submit-btn"]');

  // Return to merchant after payment
  await page.click('text=Return to Merchant');

  // Wait until the URL contains 'thank-you' indicating success
  await page.waitForURL(url => url.href.includes('thank-you'), { timeout: 15000 });

  // Assert that success message is displayed on the page
  await expect(page.locator('body')).toContainText(/thank you for your purchase/i);
});
