import { test, expect } from '@playwright/test';

test.describe('E2E Testing: Complete Workflow Builder Journey', () => {
  test('should successfully fill out the multi-step form and submit', async ({ page }) => {
    // Navigate to local dev server
    await page.goto('http://localhost:5173/');

    // Tab 1: Basic Info
    await expect(page.getByText('1. Basic Info')).toBeVisible();
    await page.getByLabel('Workflow Name').fill('My E2E Workflow');
    await page.getByLabel('Priority').selectOption('high');
    await page.getByRole('button', { name: 'Next' }).click();

    // Tab 2: Trigger Config
    await expect(page.getByText('2. Trigger')).toBeVisible();
    await page.getByLabel('Cron Expression').fill('0 12 * * *');
    await page.getByRole('button', { name: 'Next' }).click();

    // Tab 3: Actions
    await expect(page.getByText('3. Actions')).toBeVisible();
    await page.getByLabel('Retry Policy').selectOption('linear');
    await page.getByLabel('Max Retries').fill('3');
    await page.getByLabel('Timeout (seconds)').fill('120');
    await page.getByRole('button', { name: 'Next' }).click();

    // Tab 4: Review
    await expect(page.getByText('4. Review')).toBeVisible();
    await expect(page.getByText('My E2E Workflow')).toBeVisible();
    
    // Submit the form
    page.on('dialog', dialog => dialog.accept());
    await page.getByRole('button', { name: 'Submit Workflow' }).click();
  });
});
