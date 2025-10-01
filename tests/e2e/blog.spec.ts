import { test, expect } from '@playwright/test';

test.describe('Blog System', () => {
  test('should load blog page', async ({ page }) => {
    await page.goto('/blog');
    
    // Check if blog page loads
    await expect(page).toHaveTitle(/Blog/);
    
    // Check if blog header is present
    await expect(page.locator('h1')).toContainText('Blog');
    
    // Check if filter options are present
    await expect(page.locator('select[name="topic"]')).toBeVisible();
    await expect(page.locator('select[name="sort"]')).toBeVisible();
  });

  test('should allow writing new blog post', async ({ page }) => {
    await page.goto('/blog/write');
    
    // Check if editor loads
    await expect(page.locator('h1')).toContainText('Yeni Yazı');
    
    // Check if form elements are present
    await expect(page.locator('input[name="title"]')).toBeVisible();
    await expect(page.locator('select[name="topic"]')).toBeVisible();
    await expect(page.locator('textarea[name="content"]')).toBeVisible();
    
    // Test form submission
    await page.fill('input[name="title"]', 'Test Blog Post');
    await page.selectOption('select[name="topic"]', 'figures');
    await page.fill('textarea[name="content"]', 'This is a test blog post content.');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Check if success message appears
    await expect(page.locator('text=Yazı başarıyla oluşturuldu')).toBeVisible();
  });

  test('should display blog post detail', async ({ page }) => {
    // First create a blog post
    await page.goto('/blog/write');
    await page.fill('input[name="title"]', 'Test Post for Detail View');
    await page.selectOption('select[name="topic"]', 'figures');
    await page.fill('textarea[name="content"]', 'Test content for detail view.');
    await page.click('button[type="submit"]');
    
    // Navigate to the post
    await page.goto('/blog/test-post-for-detail-view');
    
    // Check if post content is displayed
    await expect(page.locator('h1')).toContainText('Test Post for Detail View');
    await expect(page.locator('text=Test content for detail view')).toBeVisible();
    
    // Check if interaction buttons are present
    await expect(page.locator('button:has-text("Beğen")')).toBeVisible();
    await expect(page.locator('button:has-text("Kaydet")')).toBeVisible();
  });

  test('should allow commenting on blog posts', async ({ page }) => {
    await page.goto('/blog/test-post-for-detail-view');
    
    // Check if comment form is present
    await expect(page.locator('textarea[name="comment"]')).toBeVisible();
    
    // Add a comment
    await page.fill('textarea[name="comment"]', 'This is a test comment.');
    await page.click('button:has-text("Yorum Yap")');
    
    // Check if comment appears
    await expect(page.locator('text=This is a test comment')).toBeVisible();
  });

  test('should have working topic filtering', async ({ page }) => {
    await page.goto('/blog');
    
    // Select a topic filter
    await page.selectOption('select[name="topic"]', 'figures');
    
    // Check if URL updates
    await expect(page).toHaveURL(/.*topic=figures.*/);
    
    // Check if only relevant posts are shown
    const posts = page.locator('[data-testid="blog-post"]');
    await expect(posts).toHaveCount.greaterThan(0);
  });
});
