import { test, expect } from '@playwright/test';

test.describe('Admin Panel', () => {
  test.beforeEach(async ({ page }) => {
    // Mock admin login
    await page.goto('/admin');
    
    // Fill login form
    await page.fill('input[name="email"]', 'admin@tdcmarket.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    
    // Wait for redirect to admin dashboard
    await page.waitForURL('/admin/dashboard');
  });

  test('should load admin dashboard', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Admin Dashboard');
    
    // Check if main modules are visible
    await expect(page.locator('text=Muhasebe')).toBeVisible();
    await expect(page.locator('text=Ticaret')).toBeVisible();
    await expect(page.locator('text=Pazarlama')).toBeVisible();
    await expect(page.locator('text=AI Lab')).toBeVisible();
  });

  test('should access blog moderation', async ({ page }) => {
    await page.click('text=Blog Moderasyon');
    
    // Check if moderation interface loads
    await expect(page.locator('h2')).toContainText('Blog Moderasyon');
    
    // Check if filter options are present
    await expect(page.locator('select[name="status"]')).toBeVisible();
    await expect(page.locator('input[name="search"]')).toBeVisible();
  });

  test('should moderate blog posts', async ({ page }) => {
    await page.goto('/admin/blog-moderasyon');
    
    // Find a pending post
    const pendingPost = page.locator('[data-testid="pending-post"]').first();
    await expect(pendingPost).toBeVisible();
    
    // Click on the post to preview
    await pendingPost.click();
    
    // Check if preview panel opens
    await expect(page.locator('[data-testid="post-preview"]')).toBeVisible();
    
    // Approve the post
    await page.click('button:has-text("Onayla")');
    
    // Check if success message appears
    await expect(page.locator('text=Yazı onaylandı')).toBeVisible();
  });

  test('should access analytics dashboard', async ({ page }) => {
    await page.click('text=Analitik');
    
    // Check if analytics dashboard loads
    await expect(page.locator('h2')).toContainText('Analitik Dashboard');
    
    // Check if charts are present
    await expect(page.locator('[data-testid="revenue-chart"]')).toBeVisible();
    await expect(page.locator('[data-testid="user-chart"]')).toBeVisible();
  });

  test('should manage products', async ({ page }) => {
    await page.click('text=Ürün Yönetimi');
    
    // Check if product management loads
    await expect(page.locator('h2')).toContainText('Ürün Yönetimi');
    
    // Check if add product button is present
    await expect(page.locator('button:has-text("Yeni Ürün")')).toBeVisible();
    
    // Test adding a new product
    await page.click('button:has-text("Yeni Ürün")');
    
    // Fill product form
    await page.fill('input[name="name"]', 'Test Product');
    await page.fill('input[name="price"]', '100');
    await page.selectOption('select[name="category"]', 'figures');
    
    // Save product
    await page.click('button:has-text("Kaydet")');
    
    // Check if product was added
    await expect(page.locator('text=Test Product')).toBeVisible();
  });

  test('should manage orders', async ({ page }) => {
    await page.click('text=Sipariş Yönetimi');
    
    // Check if order management loads
    await expect(page.locator('h2')).toContainText('Sipariş Yönetimi');
    
    // Check if order list is present
    await expect(page.locator('[data-testid="order-list"]')).toBeVisible();
    
    // Test order status update
    const orderRow = page.locator('[data-testid="order-row"]').first();
    await orderRow.click();
    
    // Update order status
    await page.selectOption('select[name="status"]', 'processing');
    await page.click('button:has-text("Güncelle")');
    
    // Check if status was updated
    await expect(page.locator('text=İşleniyor')).toBeVisible();
  });

  test('should access AI features', async ({ page }) => {
    await page.click('text=AI Lab');
    
    // Check if AI lab loads
    await expect(page.locator('h2')).toContainText('AI Lab');
    
    // Check if AI features are present
    await expect(page.locator('text=Keyword Explorer')).toBeVisible();
    await expect(page.locator('text=AI Fiyat Önerisi')).toBeVisible();
    await expect(page.locator('text=SEO Asistanı')).toBeVisible();
  });

  test('should have responsive admin interface', async ({ page }) => {
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check if mobile menu is present
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
    
    // Open mobile menu
    await page.click('[data-testid="mobile-menu-button"]');
    
    // Check if menu items are visible
    await expect(page.locator('text=Muhasebe')).toBeVisible();
    await expect(page.locator('text=Ticaret')).toBeVisible();
  });
});
