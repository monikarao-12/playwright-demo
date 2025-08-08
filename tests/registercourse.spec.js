const { test, expect } = require('@playwright/test');

test('User registers with Stripe, completes course, and verifies 100% completion', async ({ page }) => {
  test.setTimeout(2 * 60 * 1000); // Set timeout to 2 minutes

  // Step 1: Register user with Stripe Elements
  await page.goto('https://cypress.apps.cspf.co/register/basic-membership/');

  const timestamp = Date.now();
  const email = `test+${timestamp}@example.com`;

  await page.fill('input[name="user_login"]', email);
  await page.fill('input[name="user_email"]', email);
  await page.fill('input[name="meco_user_password"]', 'password123');
  await page.fill('input[name="meco_user_password_confirm"]', 'password123');
  await page.click('.payment-option-stripe');
  await page.click('.meco-submit');

  // Fill Stripe test card details
  await page.fill('input[name="cardNumber"]', '4242 4242 4242 4242');
  await page.fill('input[name="cardExpiry"]', '12/34');
  await page.fill('input[name="cardCvc"]', '123');
  await page.fill('input[name="billingName"]', 'Test User');
  await page.fill('input[name="billingPostalCode"]', '20588');
  await page.click('.SubmitButton-IconContainer');

  // Wait for thank-you page after payment
  await Promise.all([
    page.waitForURL(/thank-you/, { waitUntil: 'networkidle', timeout: 45000 }),
  ]);

  // Step 2: Visit course page and open all lesson sections
  await page.goto('https://cypress.apps.cspf.co/courses/introduction-to-coffee-brewing/');

  const headers = await page.$$('.mccs-section-header');
  for (const header of headers) {
    await header.click();
  }

  // Collect all lesson/quiz links
  const links = await page.$$eval('.mccs-lesson-row-link', els => els.map(el => el.href));
  console.log(`🧭 Found ${links.length} lessons/quizzes`);

  // Step 3: Visit each lesson/quiz and complete it
  let count = 0;

  for (const href of links) {
    count++;
    console.log(`➡️ Visiting lesson ${count}: ${href}`);

    await page.goto(href, { timeout: 10000, waitUntil: 'load' });
    await page.waitForTimeout(1500);

    // Check if lesson contains a quiz
    const isQuiz = await page.$('fieldset.mccs-quiz-question');
    if (isQuiz) {
      console.log(`📝 Detected quiz on lesson ${count}`);

      const optionLabel = page.locator('.mccs-quiz-question-option-label', { hasText: 'French Press' });
      const radioInput = optionLabel.locator('xpath=preceding-sibling::input[@type="radio"]');
      await radioInput.first().check({ force: true });
      await page.locator('#mccs-quiz-submit-bottom').click({ force: true });
    }

    // Click "Complete and Continue" if available
    const nextBtn = page.locator('text=Complete and Continue');
    if (await nextBtn.count()) {
      console.log(`✅ Clicking 'Complete and Continue' on lesson ${count}`);
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'load', timeout: 10000 }),
        nextBtn.click({ force: true }),
      ]);
    }
  }

  // Reload the course page to update progress
  await page.reload();

  await page.goto('https://cypress.apps.cspf.co/courses/introduction-to-coffee-brewing/', { waitUntil: 'load' });
  await page.waitForTimeout(2000);

  // Verify course progress shows 100% completion
  const progressText = await page.locator('.progress-text').innerText();
  expect(progressText).toMatch(/100%|Complete/i);
});
