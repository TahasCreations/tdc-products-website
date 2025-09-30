import { EventPublisher, DomainEvent } from '../../../domain/ports/events/event.publisher'
import { OutboxRepository, OutboxEvent } from '../../../domain/ports/events/event.publisher'
import { EventStore } from '../../../domain/ports/events/event.publisher'

export class OutboxService implements EventPublisher {
  constructor(
    private outboxRepository: OutboxRepository,
    private eventStore: EventStore,
    private messageBroker: MessageBroker
  ) {}

  async publish(event: DomainEvent): Promise<void> {
    // 1. Save to event store
    await this.eventStore.saveEvents(
      event.aggregateId, 
      [event], 
      event.version - 1
    )

    // 2. Save to outbox for reliable delivery
    const outboxEvent: OutboxEvent = {
      id: event.id,
      aggregateId: event.aggregateId,
      eventType: event.type,
      eventData: event.eventData,
      processed: false,
      createdAt: new Date()
    }

    await this.outboxRepository.save(outboxEvent)

    // 3. Try to publish immediately
    await this.publishToMessageBroker(event)
  }

  async publishBatch(events: DomainEvent[]): Promise<void> {
    if (events.length === 0) return

    const aggregateId = events[0].aggregateId
    const expectedVersion = events[0].version - events.length

    // 1. Save all events to event store
    await this.eventStore.saveEvents(aggregateId, events, expectedVersion)

    // 2. Save all to outbox
    const outboxEvents: OutboxEvent[] = events.map(event => ({
      id: event.id,
      aggregateId: event.aggregateId,
      eventType: event.type,
      eventData: event.eventData,
      processed: false,
      createdAt: new Date()
    }))

    await Promise.all(
      outboxEvents.map(event => this.outboxRepository.save(event))
    )

    // 3. Publish all events
    await Promise.all(
      events.map(event => this.publishToMessageBroker(event))
    )
  }

  // Background job to process failed events
  async processOutboxEvents(): Promise<void> {
    const unprocessedEvents = await this.outboxRepository.getUnprocessedEvents(100)

    for (const outboxEvent of unprocessedEvents) {
      try {
        const domainEvent: DomainEvent = {
          id: outboxEvent.id,
          type: outboxEvent.eventType,
          aggregateId: outboxEvent.aggregateId,
          aggregateType: this.getAggregateType(outboxEvent.eventType),
          eventData: outboxEvent.eventData,
          version: 1, // This should be calculated properly
          occurredAt: outboxEvent.createdAt
        }

        await this.publishToMessageBroker(domainEvent)
        await this.outboxRepository.markAsProcessed(outboxEvent.id)
      } catch (error) {
        console.error(`Failed to process outbox event ${outboxEvent.id}:`, error)
        // Implement retry logic with exponential backoff
      }
    }
  }

  private async publishToMessageBroker(event: DomainEvent): Promise<void> {
    try {
      await this.messageBroker.publish(event.type, event)
    } catch (error) {
      console.error(`Failed to publish event ${event.type}:`, error)
      throw error
    }
  }

  private getAggregateType(eventType: string): string {
    // Map event types to aggregate types
    const eventTypeMap: Record<string, string> = {
      'order.created': 'Order',
      'order.updated': 'Order',
      'order.cancelled': 'Order',
      'payment.processed': 'Payment',
      'payment.failed': 'Payment',
      'product.created': 'Product',
      'product.updated': 'Product',
      'product.deleted': 'Product'
    }

    return eventTypeMap[eventType] || 'Unknown'
  }
}

// Message Broker Interface
interface MessageBroker {
  publish(topic: string, message: any): Promise<void>
  subscribe(topic: string, handler: (message: any) => Promise<void>): Promise<void>
}



