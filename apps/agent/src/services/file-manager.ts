import { promises as fs } from 'fs'
import { join } from 'path'
import { TProduct, TCategory, generateChecksum } from '@tdc/sync-protocol'
import { logger } from '../lib/logger'

export class LocalFileManager {
  private dataDir: string

  constructor() {
    this.dataDir = process.env.DATA_DIR || join(process.cwd(), 'data')
    this.ensureDataDir()
  }

  private async ensureDataDir(): Promise<void> {
    try {
      await fs.mkdir(this.dataDir, { recursive: true })
      await fs.mkdir(join(this.dataDir, 'products'), { recursive: true })
      await fs.mkdir(join(this.dataDir, 'categories'), { recursive: true })
    } catch (error) {
      logger.error('Failed to create data directory', { error })
    }
  }

  // Product methods
  async getProducts(): Promise<TProduct[]> {
    try {
      const productsDir = join(this.dataDir, 'products')
      const files = await fs.readdir(productsDir)
      const products: TProduct[] = []

      for (const file of files) {
        if (file.endsWith('.json')) {
          const filePath = join(productsDir, file)
          const content = await fs.readFile(filePath, 'utf-8')
          const product = JSON.parse(content) as TProduct
          products.push(product)
        }
      }

      return products
    } catch (error) {
      logger.error('Failed to read products', { error })
      return []
    }
  }

  async getProduct(id: string): Promise<TProduct | null> {
    try {
      const filePath = join(this.dataDir, 'products', `${id}.json`)
      const content = await fs.readFile(filePath, 'utf-8')
      return JSON.parse(content) as TProduct
    } catch (error) {
      return null
    }
  }

  async saveProduct(product: TProduct): Promise<void> {
    try {
      const filePath = join(this.dataDir, 'products', `${product.id}.json`)
      await fs.writeFile(filePath, JSON.stringify(product, null, 2))
      
      logger.debug('Product saved', { id: product.id, rev: product.rev })
    } catch (error) {
      logger.error('Failed to save product', { error, productId: product.id })
      throw error
    }
  }

  async deleteProduct(id: string): Promise<void> {
    try {
      const filePath = join(this.dataDir, 'products', `${id}.json`)
      await fs.unlink(filePath)
      
      logger.debug('Product deleted', { id })
    } catch (error) {
      logger.error('Failed to delete product', { error, productId: id })
      throw error
    }
  }

  // Category methods
  async getCategories(): Promise<TCategory[]> {
    try {
      const categoriesDir = join(this.dataDir, 'categories')
      const files = await fs.readdir(categoriesDir)
      const categories: TCategory[] = []

      for (const file of files) {
        if (file.endsWith('.json')) {
          const filePath = join(categoriesDir, file)
          const content = await fs.readFile(filePath, 'utf-8')
          const category = JSON.parse(content) as TCategory
          categories.push(category)
        }
      }

      return categories
    } catch (error) {
      logger.error('Failed to read categories', { error })
      return []
    }
  }

  async getCategory(id: string): Promise<TCategory | null> {
    try {
      const filePath = join(this.dataDir, 'categories', `${id}.json`)
      const content = await fs.readFile(filePath, 'utf-8')
      return JSON.parse(content) as TCategory
    } catch (error) {
      return null
    }
  }

  async saveCategory(category: TCategory): Promise<void> {
    try {
      const filePath = join(this.dataDir, 'categories', `${category.id}.json`)
      await fs.writeFile(filePath, JSON.stringify(category, null, 2))
      
      logger.debug('Category saved', { id: category.id, rev: category.rev })
    } catch (error) {
      logger.error('Failed to save category', { error, categoryId: category.id })
      throw error
    }
  }

  async deleteCategory(id: string): Promise<void> {
    try {
      const filePath = join(this.dataDir, 'categories', `${id}.json`)
      await fs.unlink(filePath)
      
      logger.debug('Category deleted', { id })
    } catch (error) {
      logger.error('Failed to delete category', { error, categoryId: id })
      throw error
    }
  }

  // Utility methods
  async getLatestRevision(): Promise<number> {
    const [products, categories] = await Promise.all([
      this.getProducts(),
      this.getCategories()
    ])

    return Math.max(
      ...products.map(p => p.rev),
      ...categories.map(c => c.rev),
      0
    )
  }
}
