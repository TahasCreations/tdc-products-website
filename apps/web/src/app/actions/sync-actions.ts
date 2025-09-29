'use server'

import { prisma } from '@/lib/prisma'
import { syncClient } from '@/lib/sync-client'
import { publishEntityUpdate } from '@/lib/realtime'
import { revalidatePath } from 'next/cache'
import { TProduct, TCategory, generateChecksum } from '@tdc/sync-protocol'

/**
 * Create product with sync
 */
export async function createProductAction(input: {
  title: string
  description?: string
  price: number
  categoryId?: string
  stock?: number
  enabled?: boolean
}): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const product = await prisma.product.create({
      data: {
        title: input.title,
        description: input.description,
        price: input.price,
        categoryId: input.categoryId,
        stock: input.stock || 0,
        enabled: input.enabled ?? true,
        rev: 1,
        updatedBy: 'CLOUD',
        checksum: '',
        slug: input.title.toLowerCase().replace(/\s+/g, '-')
      }
    })

    // Update checksum
    const productData = {
      id: product.id,
      title: product.title,
      description: product.description,
      price: Number(product.price),
      categoryId: product.categoryId,
      stock: product.stock,
      enabled: product.enabled,
      rev: product.rev,
      updatedBy: 'cloud' as const,
      checksum: '',
      updatedAt: product.updatedAt.toISOString()
    }

    const checksum = generateChecksum(productData)
    const updatedProduct = await prisma.product.update({
      where: { id: product.id },
      data: { checksum }
    })

    // Push to local agent
    await syncClient.pushProductChange(
      {
        ...productData,
        name: product.title, // Map title to name for sync protocol
        checksum
      },
      'upsert'
    )

    // Publish realtime event
    await publishEntityUpdate('product', product.id, updatedProduct)

    // Revalidate cache
    revalidatePath('/admin/products')
    revalidatePath('/products')

    return { success: true, id: product.id }
  } catch (error) {
    console.error('Create product error:', error)
    return { success: false, error: 'Failed to create product' }
  }
}

/**
 * Update product with sync
 */
export async function updateProductAction(
  id: string,
  input: {
    title?: string
    description?: string
    price?: number
    categoryId?: string
    stock?: number
    enabled?: boolean
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    })

    if (!existingProduct) {
      return { success: false, error: 'Product not found' }
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...input,
        rev: { increment: 1 },
        updatedBy: 'CLOUD'
      }
    })

    // Update checksum
    const productData = {
      id: product.id,
      title: product.title,
      description: product.description,
      price: Number(product.price),
      categoryId: product.categoryId,
      stock: product.stock,
      enabled: product.enabled,
      rev: product.rev,
      updatedBy: 'cloud' as const,
      checksum: '',
      updatedAt: product.updatedAt.toISOString()
    }

    const checksum = generateChecksum(productData)
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { checksum }
    })

    // Push to local agent
    await syncClient.pushProductChange(
      {
        ...productData,
        name: product.title,
        checksum
      },
      'upsert'
    )

    // Publish realtime event
    await publishEntityUpdate('product', id, updatedProduct)

    // Revalidate cache
    revalidatePath('/admin/products')
    revalidatePath('/products')

    return { success: true }
  } catch (error) {
    console.error('Update product error:', error)
    return { success: false, error: 'Failed to update product' }
  }
}

/**
 * Delete product with sync
 */
export async function deleteProductAction(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const product = await prisma.product.findUnique({
      where: { id }
    })

    if (!product) {
      return { success: false, error: 'Product not found' }
    }

    await prisma.product.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        rev: { increment: 1 },
        updatedBy: 'CLOUD'
      }
    })

    // Push to local agent
    await syncClient.pushProductChange(
      {
        id: product.id,
        title: product.title,
        description: product.description,
        price: Number(product.price),
        categoryId: product.categoryId,
        stock: product.stock,
        enabled: product.enabled,
        rev: product.rev + 1,
        updatedBy: 'cloud' as const,
        checksum: product.checksum,
        updatedAt: new Date().toISOString(),
        deletedAt: new Date().toISOString()
      },
      'delete'
    )

    // Publish realtime event
    await publishEntityUpdate('product', id, { deleted: true })

    // Revalidate cache
    revalidatePath('/admin/products')
    revalidatePath('/products')

    return { success: true }
  } catch (error) {
    console.error('Delete product error:', error)
    return { success: false, error: 'Failed to delete product' }
  }
}

/**
 * Create category with sync
 */
export async function createCategoryAction(input: {
  name: string
  description?: string
  slug?: string
  parentId?: string
  enabled?: boolean
}): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const slug = input.slug || input.name.toLowerCase().replace(/\s+/g, '-')
    
    const category = await prisma.category.create({
      data: {
        name: input.name,
        description: input.description,
        slug,
        parentId: input.parentId,
        enabled: input.enabled ?? true,
        rev: 1,
        updatedBy: 'CLOUD',
        checksum: ''
      }
    })

    // Update checksum
    const categoryData = {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      parentId: category.parentId,
      enabled: category.enabled,
      rev: category.rev,
      updatedBy: 'cloud' as const,
      checksum: '',
      updatedAt: category.updatedAt.toISOString()
    }

    const checksum = generateChecksum(categoryData)
    const updatedCategory = await prisma.category.update({
      where: { id: category.id },
      data: { checksum }
    })

    // Push to local agent
    await syncClient.pushCategoryChange(
      {
        ...categoryData,
        checksum
      },
      'upsert'
    )

    // Publish realtime event
    await publishEntityUpdate('category', category.id, updatedCategory)

    // Revalidate cache
    revalidatePath('/admin/categories')
    revalidatePath('/categories')

    return { success: true, id: category.id }
  } catch (error) {
    console.error('Create category error:', error)
    return { success: false, error: 'Failed to create category' }
  }
}

/**
 * Update category with sync
 */
export async function updateCategoryAction(
  id: string,
  input: {
    name?: string
    description?: string
    slug?: string
    parentId?: string
    enabled?: boolean
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const existingCategory = await prisma.category.findUnique({
      where: { id }
    })

    if (!existingCategory) {
      return { success: false, error: 'Category not found' }
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        ...input,
        rev: { increment: 1 },
        updatedBy: 'CLOUD'
      }
    })

    // Update checksum
    const categoryData = {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      parentId: category.parentId,
      enabled: category.enabled,
      rev: category.rev,
      updatedBy: 'cloud' as const,
      checksum: '',
      updatedAt: category.updatedAt.toISOString()
    }

    const checksum = generateChecksum(categoryData)
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: { checksum }
    })

    // Push to local agent
    await syncClient.pushCategoryChange(
      {
        ...categoryData,
        checksum
      },
      'upsert'
    )

    // Publish realtime event
    await publishEntityUpdate('category', id, updatedCategory)

    // Revalidate cache
    revalidatePath('/admin/categories')
    revalidatePath('/categories')

    return { success: true }
  } catch (error) {
    console.error('Update category error:', error)
    return { success: false, error: 'Failed to update category' }
  }
}

/**
 * Delete category with sync
 */
export async function deleteCategoryAction(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const category = await prisma.category.findUnique({
      where: { id }
    })

    if (!category) {
      return { success: false, error: 'Category not found' }
    }

    await prisma.category.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        rev: { increment: 1 },
        updatedBy: 'CLOUD'
      }
    })

    // Push to local agent
    await syncClient.pushCategoryChange(
      {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        parentId: category.parentId,
        enabled: category.enabled,
        rev: category.rev + 1,
        updatedBy: 'cloud' as const,
        checksum: category.checksum,
        updatedAt: new Date().toISOString(),
        deletedAt: new Date().toISOString()
      },
      'delete'
    )

    // Publish realtime event
    await publishEntityUpdate('category', id, { deleted: true })

    // Revalidate cache
    revalidatePath('/admin/categories')
    revalidatePath('/categories')

    return { success: true }
  } catch (error) {
    console.error('Delete category error:', error)
    return { success: false, error: 'Failed to delete category' }
  }
}
