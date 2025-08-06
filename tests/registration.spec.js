const { test, expect } = require('@playwright/test');

test('sign up with Stripe payment', async ({ page }) => {
  // Go to the membership registration page
  await page.goto('https://cypress.apps.cspf.co/register/basic-membership/');

  // Generate a unique email using timestamp
  const timestamp = Date.now();
  const email = `test+${timestamp}@example.com`;

  // Fill out the registration form
  await page.fill('input[name="user_login"]', email);
  await page.fill('input[name="user_email"]', email);
  await page.fill('input[name="meco_user_password"]', 'password123');
  await page.fill('input[name="meco_user_password_confirm"]', 'password123');

  // Select Stripe payment option
  await page.click('.payment-option-stripe');

  // Submit the registration form
  await page.click('.meco-submit');

  // Fill Stripe card details
  await page.fill('input[name="cardNumber"]', '4242 4242 4242 4242');
  await page.fill('input[name="cardExpiry"]', '12/34');
  await page.fill('input[name="cardCvc"]', '123');
  await page.fill('input[name="billingName"]', 'Test User');

  // Submit the payment form
  await page.click('.SubmitButton-IconContainer');

  // Wait until the URL contains 'thank-you' indicating successful registration/payment
  await page.waitForURL(url => url.href.includes('thank-you'), { timeout: 15000 });

  // Verify the success message is displayed on the page
  await expect(page.locator('body')).toContainText(/thank you for your purchase/i);
});
