// Event Publisher Port
export interface DomainEvent {
  id: string
  type: string
  aggregateId: string
  aggregateType: string
  eventData: Record<string, any>
  version: number
  occurredAt: Date
  metadata?: Record<string, any>
}

export interface EventPublisher {
  publish(event: DomainEvent): Promise<void>
  publishBatch(events: DomainEvent[]): Promise<void>
}

// Event Handler Port
export interface EventHandler<T = any> {
  handle(event: T): Promise<void>
}

// Event Store Port
export interface EventStore {
  saveEvents(aggregateId: string, events: DomainEvent[], expectedVersion: number): Promise<void>
  getEvents(aggregateId: string, fromVersion?: number): Promise<DomainEvent[]>
  getEventsByType(eventType: string, fromDate?: Date): Promise<DomainEvent[]>
}

// Outbox Pattern Port
export interface OutboxRepository {
  save(event: OutboxEvent): Promise<void>
  getUnprocessedEvents(limit?: number): Promise<OutboxEvent[]>
  markAsProcessed(eventId: string): Promise<void>
}

export interface OutboxEvent {
  id: string
  aggregateId: string
  eventType: string
  eventData: Record<string, any>
  processed: boolean
  createdAt: Date
}



