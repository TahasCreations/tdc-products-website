import { test, expect } from '@playwright/test';

test.describe('TDC Market Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the main heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Türkiye'nin tasarım & figür pazarı/i })).toBeVisible();
  });

  test('should display category cards', async ({ page }) => {
    await expect(page.getByText('3D Figürler')).toBeVisible();
    await expect(page.getByText('Masaüstü Aksesuarları')).toBeVisible();
    await expect(page.getByText('Hediye Ürünleri')).toBeVisible();
  });

  test('should display collection strips', async ({ page }) => {
    await expect(page.getByText('Haftanın Trendleri')).toBeVisible();
    await expect(page.getByText('Yerel Tasarımcılar')).toBeVisible();
    await expect(page.getByText('Limited Figürler')).toBeVisible();
    await expect(page.getByText('Hediye Rehberi')).toBeVisible();
  });

  test('should display store spotlight', async ({ page }) => {
    await expect(page.getByText('ArtisanCraft Studio')).toBeVisible();
    await expect(page.getByText('TechGadgets 3D')).toBeVisible();
    await expect(page.getByText('NatureCraft')).toBeVisible();
  });

  test('should display trust section', async ({ page }) => {
    await expect(page.getByText('Güvenli Ödeme')).toBeVisible();
    await expect(page.getByText('Hızlı Kargo')).toBeVisible();
    await expect(page.getByText('Doğrulanmış Satıcı')).toBeVisible();
  });

  test('should display blog section', async ({ page }) => {
    await expect(page.getByText('3D Yazıcı Teknolojisi ile Figür Üretimi')).toBeVisible();
    await expect(page.getByText('Ev Dekorasyonunda 3D Figürlerin Yeri')).toBeVisible();
    await expect(page.getByText('Hediye Seçiminde 3D Figürler')).toBeVisible();
  });

  test('should handle search functionality', async ({ page }) => {
    const searchInput = page.getByPlaceholder('3D figür, karakter, dekoratif obje ara...');
    await expect(searchInput).toBeVisible();
    
    await searchInput.fill('anime figür');
    await searchInput.press('Enter');
    
    // Should navigate to search page
    await expect(page).toHaveURL(/\/search\?q=anime%20figür/);
  });

  test('should handle category clicks', async ({ page }) => {
    const categoryCard = page.getByText('3D Figürler').first();
    await expect(categoryCard).toBeVisible();
    
    await categoryCard.click();
    
    // Should navigate to category page
    await expect(page).toHaveURL(/\/categories\/3d-figurler/);
  });

  test('should handle coupon copy functionality', async ({ page }) => {
    const copyButton = page.getByText('Kodu Kopyala');
    await expect(copyButton).toBeVisible();
    
    await copyButton.click();
    
    // Should show copied state
    await expect(page.getByText('Kopyalandı!')).toBeVisible();
  });

  test('should handle store clicks', async ({ page }) => {
    const storeButton = page.getByText('Mağazaya Git').first();
    await expect(storeButton).toBeVisible();
    
    await storeButton.click();
    
    // Should navigate to store page
    await expect(page).toHaveURL(/\/store\/artisancraft-studio/);
  });

  test('should handle product clicks in collections', async ({ page }) => {
    const productCard = page.getByText('Anime Karakter Figürü').first();
    await expect(productCard).toBeVisible();
    
    await productCard.click();
    
    // Should navigate to product page
    await expect(page).toHaveURL(/\/products\/1/);
  });

  test('should handle blog post clicks', async ({ page }) => {
    const blogPost = page.getByText('3D Yazıcı Teknolojisi ile Figür Üretimi');
    await expect(blogPost).toBeVisible();
    
    await blogPost.click();
    
    // Should navigate to blog post page
    await expect(page).toHaveURL(/\/blog\/1/);
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check if main heading is visible on mobile
    await expect(page.getByRole('heading', { name: /Türkiye'nin tasarım & figür pazarı/i })).toBeVisible();
    
    // Check if category grid is responsive
    await expect(page.getByText('3D Figürler')).toBeVisible();
  });

  test('should be responsive on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // Check if layout adapts to tablet size
    await expect(page.getByRole('heading', { name: /Türkiye'nin tasarım & figür pazarı/i })).toBeVisible();
    await expect(page.getByText('3D Figürler')).toBeVisible();
  });

  test('should have proper accessibility attributes', async ({ page }) => {
    // Check for skip link
    await expect(page.getByRole('link', { name: 'Ana içeriğe geç' })).toBeVisible();
    
    // Check for proper heading hierarchy
    const mainHeading = page.getByRole('heading', { level: 1 });
    await expect(mainHeading).toBeVisible();
    
    // Check for proper button labels
    const searchButton = page.getByRole('button', { name: 'Arama yap' });
    await expect(searchButton).toBeVisible();
    
    // Check for proper link labels
    const categoryLink = page.getByRole('link', { name: /3D Figürler kategorisini görüntüle/i });
    await expect(categoryLink).toBeVisible();
  });

  test('should load images properly', async ({ page }) => {
    // Wait for images to load
    await page.waitForLoadState('networkidle');
    
    // Check if hero images are loaded
    const heroImages = page.locator('img[alt*="3D Figür"]');
    await expect(heroImages.first()).toBeVisible();
    
    // Check if category images are loaded
    const categoryImages = page.locator('img[alt*="3D Figürler"]');
    await expect(categoryImages.first()).toBeVisible();
  });

  test('should handle keyboard navigation', async ({ page }) => {
    // Tab through interactive elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Check if focus is visible
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('should display announcement bar', async ({ page }) => {
    await expect(page.getByText('%7 komisyon • Özel domain • 14 gün iade')).toBeVisible();
  });

  test('should close announcement bar', async ({ page }) => {
    const closeButton = page.getByRole('button', { name: 'Duyuruyu kapat' });
    await expect(closeButton).toBeVisible();
    
    await closeButton.click();
    
    // Announcement bar should be hidden
    await expect(page.getByText('%7 komisyon • Özel domain • 14 gün iade')).not.toBeVisible();
  });

  test('should have proper meta tags', async ({ page }) => {
    // Check title
    await expect(page).toHaveTitle(/TDC Market - Türkiye'nin Tasarım & Figür Pazarı/);
    
    // Check meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /AI destekli arama, özel domainli mağazalar, düşük komisyon/);
  });

  test('should have proper Open Graph tags', async ({ page }) => {
    // Check OG title
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute('content', /TDC Market - Türkiye'nin Tasarım & Figür Pazarı/);
    
    // Check OG description
    const ogDescription = page.locator('meta[property="og:description"]');
    await expect(ogDescription).toHaveAttribute('content', /AI destekli arama, özel domainli mağazalar, düşük komisyon/);
  });
});

