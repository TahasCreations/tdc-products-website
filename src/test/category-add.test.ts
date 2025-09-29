/**
 * Category Add Functionality Tests
 * Tests the complete category addition flow
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fileStorageManager } from '../lib/file-storage-manager';

// Mock console.log to avoid noise in tests
const originalConsoleLog = console.log;
beforeEach(() => {
  console.log = vi.fn();
});

afterEach(() => {
  console.log = originalConsoleLog;
});

describe('Category Add Functionality', () => {
  beforeEach(async () => {
    // Clear all categories before each test (delete subcategories first)
    const categories = await fileStorageManager.getCategories();
    
    // Delete subcategories first
    const subcategories = categories.filter(c => c.level === 2 || c.parent_id);
    for (const category of subcategories) {
      try {
        await fileStorageManager.deleteCategory(category.id);
      } catch (error) {
        // Ignore errors during cleanup
      }
    }
    
    // Then delete main categories
    const mainCategories = categories.filter(c => c.level === 1 || !c.parent_id);
    for (const category of mainCategories) {
      try {
        await fileStorageManager.deleteCategory(category.id);
      } catch (error) {
        // Ignore errors during cleanup
      }
    }
  });

  it('should add a main category successfully', async () => {
    const categoryData = {
      name: 'Test Kategori',
      description: 'Test açıklama',
      emoji: '🧪',
      color: '#6b7280',
      icon: 'ri-more-line',
      parent_id: null,
      level: 1
    };

    const result = await fileStorageManager.addCategory(categoryData);

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.name).toBe('Test Kategori');
    expect(result.description).toBe('Test açıklama');
    expect(result.emoji).toBe('🧪');
    expect(result.parent_id).toBeNull();
    expect(result.level).toBe(1);
    expect(result.created_at).toBeDefined();
    expect(result.updated_at).toBeDefined();

    // Verify it's saved to file
    const categories = await fileStorageManager.getCategories();
    expect(categories).toHaveLength(1);
    expect(categories[0].id).toBe(result.id);
  });

  it('should add a subcategory successfully', async () => {
    // First create a main category
    const mainCategory = await fileStorageManager.addCategory({
      name: 'Ana Kategori',
      description: 'Ana kategori açıklama',
      emoji: '📁',
      color: '#3B82F6',
      icon: 'ri-folder-line',
      parent_id: null,
      level: 1
    });

    // Then create a subcategory
    const subCategoryData = {
      name: 'Alt Kategori',
      description: 'Alt kategori açıklama',
      emoji: '📄',
      color: '#10B981',
      icon: 'ri-file-line',
      parent_id: mainCategory.id,
      level: 2
    };

    const result = await fileStorageManager.addCategory(subCategoryData);

    expect(result).toBeDefined();
    expect(result.name).toBe('Alt Kategori');
    expect(result.parent_id).toBe(mainCategory.id);
    expect(result.level).toBe(2);

    // Verify both categories exist
    const categories = await fileStorageManager.getCategories();
    expect(categories).toHaveLength(2);
  });

  it('should generate unique IDs for different categories', async () => {
    const category1 = await fileStorageManager.addCategory({
      name: 'Kategori 1',
      description: 'Test',
      emoji: '📁',
      color: '#3B82F6',
      icon: 'ri-folder-line',
      parent_id: null,
      level: 1
    });

    const category2 = await fileStorageManager.addCategory({
      name: 'Kategori 2',
      description: 'Test',
      emoji: '📁',
      color: '#3B82F6',
      icon: 'ri-folder-line',
      parent_id: null,
      level: 1
    });

    expect(category1.id).not.toBe(category2.id);
  });

  it('should handle Turkish characters in category names', async () => {
    const categoryData = {
      name: 'Türkçe Kategori Örnek',
      description: 'Türkçe karakter test',
      emoji: '🇹🇷',
      color: '#EF4444',
      icon: 'ri-flag-line',
      parent_id: null,
      level: 1
    };

    const result = await fileStorageManager.addCategory(categoryData);

    expect(result.name).toBe('Türkçe Kategori Örnek');
    expect(result.description).toBe('Türkçe karakter test');
    expect(result.emoji).toBe('🇹🇷');
  });

  it('should handle empty description gracefully', async () => {
    const categoryData = {
      name: 'Minimal Kategori',
      description: '',
      emoji: '📁',
      color: '#6B7280',
      icon: 'ri-folder-line',
      parent_id: null,
      level: 1
    };

    const result = await fileStorageManager.addCategory(categoryData);

    expect(result.name).toBe('Minimal Kategori');
    expect(result.description).toBe('');
  });
});

describe('Slug Generation', () => {
  it('should generate proper slug from Turkish text', () => {
    const name = 'Türkçe Kategori Örnek';
    const expectedSlug = 'turkce-kategori-ornek';
    
    const slug = name.trim()
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    expect(slug).toBe(expectedSlug);
  });

  it('should handle special characters in slug generation', () => {
    const name = 'Kategori & Test (Örnek) - V2.0';
    const expectedSlug = 'kategori-test-ornek-v20';
    
    const slug = name.trim()
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    expect(slug).toBe(expectedSlug);
  });
});
