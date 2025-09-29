import Pusher from 'pusher'

// Initialize Pusher
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID || 'dummy',
  key: process.env.PUSHER_KEY || 'dummy',
  secret: process.env.PUSHER_SECRET || 'dummy',
  cluster: process.env.PUSHER_CLUSTER || 'eu',
  useTLS: true
})

export interface RealtimeEvent {
  type: string;
  entity: string;
  entityId: string;
  data?: any;
  timestamp: string;
}

/**
 * Publish realtime event
 */
export async function publish(event: RealtimeEvent): Promise<void> {
  try {
    await pusher.trigger(
      `sync-${event.entity}`,
      event.type,
      event
    )
    
    console.log(`Published event: ${event.type} for ${event.entity}:${event.entityId}`)
  } catch (error) {
    console.error('Failed to publish realtime event:', error)
    // Don't throw - realtime is not critical for sync
  }
}

/**
 * Publish entity update event
 */
export async function publishEntityUpdate(
  entity: string,
  entityId: string,
  data?: any
): Promise<void> {
  await publish({
    type: `${entity}:updated`,
    entity,
    entityId,
    data,
    timestamp: new Date().toISOString()
  })
}

/**
 * Publish sync status event
 */
export async function publishSyncStatus(
  status: 'started' | 'completed' | 'failed',
  details?: any
): Promise<void> {
  await publish({
    type: 'sync:status',
    entity: 'sync',
    entityId: 'status',
    data: { status, ...details },
    timestamp: new Date().toISOString()
  })
}