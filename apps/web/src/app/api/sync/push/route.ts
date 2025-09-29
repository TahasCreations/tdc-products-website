import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { 
  ChangeBatch, 
  SyncPushResponse, 
  TChange, 
  generateChecksum,
  resolveConflict,
  ConflictStrategy
} from '@tdc/sync-protocol'
import { publish } from '@/lib/realtime'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Authentication
    const token = request.headers.get('x-sync-token')
    if (token !== process.env.SYNC_TOKEN) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json()
    const parsed = ChangeBatch.parse(body)

    const conflicts: any[] = []
    let appliedCount = 0
    let latestRev = 0

    // Process changes in transaction
    await prisma.$transaction(async (tx) => {
      for (const change of parsed.changes) {
        const result = await processChange(tx, change, parsed.clientRev)
        
        if (result.success) {
          appliedCount++
          latestRev = Math.max(latestRev, result.rev || 0)
        } else if (result.conflict) {
          conflicts.push(result.conflict)
        }
      }
    })

    // Publish realtime events
    await publish({
      type: 'sync:batch-applied',
      entity: 'sync',
      entityId: 'batch',
      data: { appliedCount, conflictsCount: conflicts.length },
      timestamp: new Date().toISOString()
    })

    const response: SyncPushResponse = {
      success: true,
      conflicts: conflicts.length > 0 ? conflicts : undefined,
      appliedCount,
      latestRev
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Sync push error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function processChange(
  tx: any,
  change: TChange,
  clientRev: number
): Promise<{ success: boolean; rev?: number; conflict?: any }> {
  try {
    const { entity, op, data } = change

    if (entity === 'product') {
      return await processProductChange(tx, op, data, clientRev)
    } else if (entity === 'category') {
      return await processCategoryChange(tx, op, data, clientRev)
    }

    return { success: false }
  } catch (error) {
    console.error('Process change error:', error)
    return { success: false }
  }
}

async function processProductChange(
  tx: any,
  op: string,
  data: any,
  clientRev: number
): Promise<{ success: boolean; rev?: number; conflict?: any }> {
  if (op === 'delete') {
    await tx.product.update({
      where: { id: data.id },
      data: {
        deletedAt: new Date().toISOString(),
        rev: { increment: 1 },
        updatedBy: 'local',
        updatedAt: new Date().toISOString()
      }
    })
    return { success: true, rev: clientRev + 1 }
  }

  // Upsert operation
  const current = await tx.product.findUnique({
    where: { id: data.id }
  })

  if (current && current.deletedAt) {
    // Don't update deleted products
    return { success: false }
  }

  // Check for conflicts
  if (current && current.rev !== data.rev) {
    const conflict = resolveConflict(current, data, ConflictStrategy.LAST_WRITE_WINS)
    
    if (conflict.winner === 'current') {
      return {
        success: false,
        conflict: {
          entity: 'product',
          id: data.id,
          currentRev: current.rev,
          incomingRev: data.rev,
          decided: 'current'
        }
      }
    }
  }

  // Generate new checksum
  const checksum = generateChecksum(data)
  const newRev = Math.max((current?.rev || 0) + 1, clientRev + 1)

  await tx.product.upsert({
    where: { id: data.id },
    update: {
      name: data.name,
      price: data.price,
      enabled: data.enabled,
      description: data.description,
      categoryId: data.categoryId,
      rev: newRev,
      updatedBy: 'local',
      checksum,
      updatedAt: new Date().toISOString(),
      deletedAt: null
    },
    create: {
      id: data.id,
      name: data.name,
      price: data.price,
      enabled: data.enabled,
      description: data.description,
      categoryId: data.categoryId,
      rev: newRev,
      updatedBy: 'local',
      checksum,
      updatedAt: new Date().toISOString()
    }
  })

  return { success: true, rev: newRev }
}

async function processCategoryChange(
  tx: any,
  op: string,
  data: any,
  clientRev: number
): Promise<{ success: boolean; rev?: number; conflict?: any }> {
  if (op === 'delete') {
    await tx.category.update({
      where: { id: data.id },
      data: {
        deletedAt: new Date().toISOString(),
        rev: { increment: 1 },
        updatedBy: 'local',
        updatedAt: new Date().toISOString()
      }
    })
    return { success: true, rev: clientRev + 1 }
  }

  // Upsert operation
  const current = await tx.category.findUnique({
    where: { id: data.id }
  })

  if (current && current.deletedAt) {
    return { success: false }
  }

  // Check for conflicts
  if (current && current.rev !== data.rev) {
    const conflict = resolveConflict(current, data, ConflictStrategy.LAST_WRITE_WINS)
    
    if (conflict.winner === 'current') {
      return {
        success: false,
        conflict: {
          entity: 'category',
          id: data.id,
          currentRev: current.rev,
          incomingRev: data.rev,
          decided: 'current'
        }
      }
    }
  }

  // Generate new checksum
  const checksum = generateChecksum(data)
  const newRev = Math.max((current?.rev || 0) + 1, clientRev + 1)

  await tx.category.upsert({
    where: { id: data.id },
    update: {
      name: data.name,
      slug: data.slug,
      enabled: data.enabled,
      description: data.description,
      parentId: data.parentId,
      rev: newRev,
      updatedBy: 'local',
      checksum,
      updatedAt: new Date().toISOString(),
      deletedAt: null
    },
    create: {
      id: data.id,
      name: data.name,
      slug: data.slug,
      enabled: data.enabled,
      description: data.description,
      parentId: data.parentId,
      rev: newRev,
      updatedBy: 'local',
      checksum,
      updatedAt: new Date().toISOString()
    }
  })

  return { success: true, rev: newRev }
}
