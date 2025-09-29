import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { 
  SyncPullResponse, 
  TChange,
  Change
} from '@tdc/sync-protocol'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Authentication
    const token = request.headers.get('x-sync-token')
    if (token !== process.env.SYNC_TOKEN) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse query parameters
    const url = new URL(request.url)
    const sinceRev = parseInt(url.searchParams.get('sinceRev') || '0')
    const limit = parseInt(url.searchParams.get('limit') || '100')

    // Fetch changes from database
    const changes = await fetchChanges(sinceRev, limit)

    // Get latest revision
    const latestRev = await getLatestRevision()

    const response: SyncPullResponse = {
      sinceRev,
      latestRev,
      changes,
      hasMore: changes.length === limit
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Sync pull error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function fetchChanges(sinceRev: number, limit: number): Promise<TChange[]> {
  const changes: TChange[] = []

  // Fetch product changes
  const productChanges = await prisma.product.findMany({
    where: {
      rev: { gt: sinceRev }
    },
    orderBy: { rev: 'asc' },
    take: limit
  })

  for (const product of productChanges) {
    if (product.deletedAt) {
      changes.push({
        entity: 'product',
        op: 'delete',
        data: {
          id: product.id,
          updatedAt: product.updatedAt.toISOString(),
          rev: product.rev,
          updatedBy: product.updatedBy as 'cloud' | 'local',
          checksum: product.checksum,
          deletedAt: product.deletedAt?.toISOString() || null
        }
      })
    } else {
      changes.push({
        entity: 'product',
        op: 'upsert',
        data: {
          id: product.id,
          name: product.title,
          price: product.price,
          enabled: product.enabled,
          description: product.description,
          categoryId: product.categoryId,
          updatedAt: product.updatedAt.toISOString(),
          rev: product.rev,
          updatedBy: product.updatedBy as 'cloud' | 'local',
          checksum: product.checksum,
          deletedAt: product.deletedAt?.toISOString() || null
        }
      })
    }
  }

  // Fetch category changes
  const categoryChanges = await prisma.category.findMany({
    where: {
      rev: { gt: sinceRev }
    },
    orderBy: { rev: 'asc' },
    take: limit - changes.length
  })

  for (const category of categoryChanges) {
    if (category.deletedAt) {
      changes.push({
        entity: 'category',
        op: 'delete',
        data: {
          id: category.id,
          updatedAt: category.updatedAt.toISOString(),
          rev: category.rev,
          updatedBy: category.updatedBy as 'cloud' | 'local',
          checksum: category.checksum,
          deletedAt: category.deletedAt?.toISOString() || null
        }
      })
    } else {
      changes.push({
        entity: 'category',
        op: 'upsert',
        data: {
          id: category.id,
          name: category.name,
          slug: category.slug,
          enabled: category.enabled,
          description: category.description,
          parentId: category.parentId,
          updatedAt: category.updatedAt.toISOString(),
          rev: category.rev,
          updatedBy: category.updatedBy as 'cloud' | 'local',
          checksum: category.checksum,
          deletedAt: category.deletedAt?.toISOString() || null
        }
      })
    }
  }

  // Sort all changes by revision
  return changes.sort((a, b) => a.data.rev - b.data.rev)
}

async function getLatestRevision(): Promise<number> {
  const [maxProductRev, maxCategoryRev] = await Promise.all([
    prisma.product.aggregate({
      _max: { rev: true }
    }),
    prisma.category.aggregate({
      _max: { rev: true }
    })
  ])

  return Math.max(
    maxProductRev._max.rev || 0,
    maxCategoryRev._max.rev || 0
  )
}
