import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check if the page loads
    await expect(page).toHaveTitle(/TDC Market/);
    
    // Check if hero section is visible
    await expect(page.locator('h1')).toContainText('TDC Market');
    
    // Check if navigation is present
    await expect(page.locator('nav')).toBeVisible();
    
    // Check if auth buttons are present
    await expect(page.locator('button:has-text("Giriş")')).toBeVisible();
    await expect(page.locator('button:has-text("Satıcı Girişi")')).toBeVisible();
  });

  test('should display category strip', async ({ page }) => {
    await page.goto('/');
    
    // Check if categories are displayed
    await expect(page.locator('text=Popüler Kategoriler')).toBeVisible();
    
    // Check if category cards are present
    const categoryCards = page.locator('[data-testid="category-card"]');
    await expect(categoryCards).toHaveCount(6);
  });

  test('should display collection strips', async ({ page }) => {
    await page.goto('/');
    
    // Check if collection strips are visible
    await expect(page.locator('text=Haftanın Trendleri')).toBeVisible();
    await expect(page.locator('text=Özel Figürler — TDC Products')).toBeVisible();
    await expect(page.locator('text=Günlük Yaşam Favorileri')).toBeVisible();
    await expect(page.locator('text=Bütçe Dostu Hediyeler')).toBeVisible();
  });

  test('should have working search functionality', async ({ page }) => {
    await page.goto('/');
    
    // Test search input
    const searchInput = page.locator('input[placeholder*="ara"]');
    await searchInput.fill('figür');
    await searchInput.press('Enter');
    
    // Check if search was triggered (you might need to adjust this based on your implementation)
    await expect(page).toHaveURL(/.*search.*/);
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check if mobile menu button is visible
    await expect(page.locator('button[aria-label*="menu"]')).toBeVisible();
    
    // Check if content is properly stacked
    await expect(page.locator('h1')).toBeVisible();
  });
});
