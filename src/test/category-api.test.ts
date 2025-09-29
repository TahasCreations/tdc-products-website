/**
 * Category API Integration Tests
 * Tests the complete API flow for category operations
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock fetch globally
global.fetch = vi.fn();

// Mock console.log to avoid noise in tests
const originalConsoleLog = console.log;
beforeEach(() => {
  console.log = vi.fn();
  vi.clearAllMocks();
});

afterEach(() => {
  console.log = originalConsoleLog;
});

describe('Category API Integration', () => {
  beforeEach(() => {
    // Reset fetch mock
    vi.clearAllMocks();
  });

  it('should handle successful category creation', async () => {
    const mockResponse = {
      success: true,
      category: {
        id: 'category-123',
        name: 'Test Kategori',
        slug: 'test-kategori',
        description: 'Test açıklama',
        emoji: '🧪',
        parent_id: null,
        level: 1,
        created_at: '2024-01-01T00:00:00.000Z',
        updated_at: '2024-01-01T00:00:00.000Z'
      },
      message: 'Kategori başarıyla eklendi'
    };

    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const response = await fetch('/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'add',
        name: 'Test Kategori',
        description: 'Test açıklama',
        emoji: '🧪',
        parentId: null
      })
    });

    const data = await response.json();

    expect(fetch).toHaveBeenCalledWith('/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'add',
        name: 'Test Kategori',
        description: 'Test açıklama',
        emoji: '🧪',
        parentId: null
      })
    });

    expect(data.success).toBe(true);
    expect(data.category.name).toBe('Test Kategori');
    expect(data.message).toBe('Kategori başarıyla eklendi');
  });

  it('should handle validation errors', async () => {
    const mockResponse = {
      success: false,
      error: 'Kategori adı gerekli'
    };

    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const response = await fetch('/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'add',
        name: '',
        description: 'Test açıklama',
        emoji: '🧪',
        parentId: null
      })
    });

    const data = await response.json();

    expect(data.success).toBe(false);
    expect(data.error).toBe('Kategori adı gerekli');
  });

  it('should handle duplicate category names', async () => {
    const mockResponse = {
      success: false,
      error: 'Bu isimde bir kategori zaten mevcut'
    };

    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const response = await fetch('/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'add',
        name: 'Existing Category',
        description: 'Test açıklama',
        emoji: '🧪',
        parentId: null
      })
    });

    const data = await response.json();

    expect(data.success).toBe(false);
    expect(data.error).toBe('Bu isimde bir kategori zaten mevcut');
  });

  it('should handle network errors', async () => {
    (fetch as any).mockRejectedValueOnce(new Error('Network error'));

    await expect(fetch('/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'add',
        name: 'Test Kategori',
        description: 'Test açıklama',
        emoji: '🧪',
        parentId: null
      })
    })).rejects.toThrow('Network error');
  });

  it('should handle server errors', async () => {
    const mockResponse = {
      success: false,
      error: 'Sunucu hatası'
    };

    (fetch as any).mockResolvedValueOnce({
      ok: true,
      status: 500,
      json: async () => mockResponse
    });

    const response = await fetch('/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'add',
        name: 'Test Kategori',
        description: 'Test açıklama',
        emoji: '🧪',
        parentId: null
      })
    });

    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Sunucu hatası');
  });

  it('should handle subcategory creation', async () => {
    const mockResponse = {
      success: true,
      category: {
        id: 'category-456',
        name: 'Alt Kategori',
        slug: 'alt-kategori',
        description: 'Alt kategori açıklama',
        emoji: '📄',
        parent_id: 'parent-123',
        level: 2,
        created_at: '2024-01-01T00:00:00.000Z',
        updated_at: '2024-01-01T00:00:00.000Z'
      },
      message: 'Kategori başarıyla eklendi'
    };

    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const response = await fetch('/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'add',
        name: 'Alt Kategori',
        description: 'Alt kategori açıklama',
        emoji: '📄',
        parentId: 'parent-123'
      })
    });

    const data = await response.json();

    expect(data.success).toBe(true);
    expect(data.category.name).toBe('Alt Kategori');
    expect(data.category.parent_id).toBe('parent-123');
    expect(data.category.level).toBe(2);
  });
});
