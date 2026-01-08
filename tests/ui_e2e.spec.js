const { test, expect } = require('@playwright/test');

test.describe('Elite Drive E2E Tests', () => {

    test('Homepage loads with Elite Drive title', async ({ page }) => {
        await page.goto('/');
        await expect(page.getByText('Elite Drive')).toBeVisible();
    });

    test('Car Gallery displays vehicles', async ({ page }) => {
        await page.goto('/');
        await page.waitForSelector('.bg-elite-card', { timeout: 10000 });
        const carCards = page.locator('.bg-elite-card');
        const count = await carCards.count();
        expect(count).toBeGreaterThan(0);
    });

    test('Can navigate to vehicle detail', async ({ page }) => {
        await page.goto('/');
        await page.waitForSelector('.bg-elite-card');
        await page.locator('a:has-text("Reserve Experience")').first().click();
        await expect(page.getByText('Schedule Viewing')).toBeVisible();
    });

    test('Customer Lounge accessible', async ({ page }) => {
        await page.goto('/lounge');
        await expect(page.getByText('Client Access')).toBeVisible();
    });

});
