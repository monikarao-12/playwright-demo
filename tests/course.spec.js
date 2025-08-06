const { test, expect } = require('@playwright/test');

test('Complete all lessons/quizzes and verify 100% course completion', async ({ page }) => {
  // Login
  await page.goto('https://cypress.apps.cspf.co/login/');
  await page.fill('#user_login', 'tester13@gmail.com');
  await page.fill('#user_pass', '12345');
  await page.click('#wp-submit');

  // Go to course
  await page.goto('https://cypress.apps.cspf.co/courses/introduction-to-coffee-brewing/');

  // Expand all sections
  const headers = await page.$$('.mccs-section-header');
  for (const header of headers) {
    await header.click();
  }

  // Get all lesson and quiz links
  const links = await page.$$eval('.mccs-lesson-row-link', els => els.map(el => el.href));

  for (const href of links) {
    await page.goto(href);
    await page.waitForTimeout(1500);

    const nextBtn = page.locator('text=Complete and Continue');
    if (await nextBtn.count()) {
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'load' }),
        nextBtn.click({ force: true }),
      ]);
    }

    const isQuiz = await page.$('fieldset.mccs-quiz-question');
   if (isQuiz) {
  const optionLabel = page.locator('.mccs-quiz-question-option-label', { hasText: 'French Press' });
  const radioInput = optionLabel.locator('xpath=preceding-sibling::input[@type="radio"]');

  await radioInput.first().check({ force: true });

  await page.locator('#mccs-quiz-submit-bottom').click({ force: true });
  await page.waitForTimeout(1500);
}
 }

  // Verify 100% completion
  await page.goto('https://cypress.apps.cspf.co/courses/introduction-to-coffee-brewing/', { waitUntil: 'load' });
  const progressText = await page.locator('.progress-text').innerText();
  expect(progressText).toMatch(/100%|Complete/i);
  console.log('✅ Course progress is 100% complete');
});
