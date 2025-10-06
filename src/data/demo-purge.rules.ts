/**
 * Demo Data Purge Rules
 * 
 * Bu dosya demo verilerini temizlemek için kullanılan kuralları içerir.
 * Gerçek kullanıcı verilerine dokunmamak için dikkatli seçilmiş desenler.
 */

// Demo e-posta desenleri
export const DEMO_EMAIL_PATTERNS = [
  /@example\.com$/i,
  /\+demo@/i,
  /\.demo@/i,
  /@demo\./i,
  /@test\./i,
  /@localhost/i,
  /@fake\./i
];

// Demo ürün desenleri (başlık, SKU, açıklama)
export const DEMO_PRODUCT_PATTERNS = [
  /\bdemo\b/i,
  /\börnek\b/i,
  /\blorem\b/i,
  /^DEMO-/i,
  /^TEST-/i,
  /\btest\b/i,
  /\bsample\b/i,
  /\bplaceholder\b/i,
  /\börnek ürün\b/i,
  /\bdemo ürün\b/i,
  /lorem ipsum/i,
  /ipsum dolor/i
];

// Demo görsel ipuçları (URL'lerde)
export const DEMO_IMAGE_HINTS = [
  "/demo/",
  "/seed/",
  "/placeholders/",
  "/test/",
  "/sample/",
  "placeholder",
  "demo-image",
  "lorem-image",
  "sample-image",
  "test-image"
];

// GCS'de temizlenecek demo önekleri
export const GCS_DEMO_PREFIXES = [
  "demo/",
  "seed/",
  "placeholders/",
  "test/",
  "sample/",
  "dummy/"
];

// Korunacak e-postalar (ADMIN_EMAILS env'den)
export const PROTECT_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

// Agresif mod bayrağı
export const AGGRESSIVE = (process.env.DEMO_PURGE_AGGRESSIVE ?? "false") === "true";

// Demo kategori/koleksiyon desenleri
export const DEMO_CATEGORY_PATTERNS = [
  /\bdemo\b/i,
  /\börnek\b/i,
  /\btest\b/i,
  /\bsample\b/i,
  /^DEMO-/i,
  /^TEST-/i
];

// Demo blog/ içerik desenleri
export const DEMO_CONTENT_PATTERNS = [
  /\blorem\b/i,
  /\bdemo\b/i,
  /\börnek\b/i,
  /\btest\b/i,
  /\bsample\b/i,
  /lorem ipsum/i,
  /ipsum dolor/i,
  /\bplaceholder\b/i
];

// Demo meta alanları
export const DEMO_META_FIELDS = [
  'isDemo',
  'isTest',
  'isSample',
  'isPlaceholder',
  'demo',
  'test',
  'sample'
];

/**
 * E-posta adresinin demo olup olmadığını kontrol eder
 */
export function isDemoEmail(email: string): boolean {
  if (PROTECT_EMAILS.includes(email)) {
    return false;
  }
  
  return DEMO_EMAIL_PATTERNS.some(pattern => pattern.test(email));
}

/**
 * Metnin demo içerik olup olmadığını kontrol eder
 */
export function isDemoContent(text: string): boolean {
  if (!text) return false;
  
  return DEMO_CONTENT_PATTERNS.some(pattern => pattern.test(text));
}

/**
 * Ürünün demo olup olmadığını kontrol eder
 */
export function isDemoProduct(product: any): boolean {
  // Başlık kontrol et
  if (product.title && DEMO_PRODUCT_PATTERNS.some(pattern => pattern.test(product.title))) {
    return true;
  }
  
  // Açıklama kontrol et
  if (product.description && DEMO_PRODUCT_PATTERNS.some(pattern => pattern.test(product.description))) {
    return true;
  }
  
  // Slug kontrol et
  if (product.slug && DEMO_PRODUCT_PATTERNS.some(pattern => pattern.test(product.slug))) {
    return true;
  }
  
  // Kategori kontrol et
  if (product.category && DEMO_CATEGORY_PATTERNS.some(pattern => pattern.test(product.category))) {
    return true;
  }
  
  return false;
}

/**
 * Kategori/koleksiyonun demo olup olmadığını kontrol eder
 */
export function isDemoCategory(category: any): boolean {
  // Meta alanları kontrol et
  if (category.meta) {
    for (const field of DEMO_META_FIELDS) {
      if (category.meta[field] === true || category.meta[field] === "true") {
        return true;
      }
    }
  }
  
  // İsim kontrol et
  if (category.name && DEMO_CATEGORY_PATTERNS.some(pattern => pattern.test(category.name))) {
    return true;
  }
  
  return false;
}

/**
 * Görsel URL'inin demo olup olmadığını kontrol eder
 */
export function isDemoImage(imageUrl: string): boolean {
  if (!imageUrl) return false;
  
  return DEMO_IMAGE_HINTS.some(hint => imageUrl.includes(hint));
}
