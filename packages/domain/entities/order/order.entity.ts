import { DomainEvent } from '../../ports/events/event.publisher'

export class Order {
  private events: DomainEvent[] = []

  constructor(
    public readonly id: string,
    public readonly customerId: string,
    public readonly tenantId: string,
    private _status: OrderStatus,
    private _totalAmount: number,
    private _items: OrderItem[],
    public readonly createdAt: Date = new Date(),
    private _updatedAt: Date = new Date()
  ) {}

  get status(): OrderStatus {
    return this._status
  }

  get totalAmount(): number {
    return this._totalAmount
  }

  get items(): readonly OrderItem[] {
    return [...this._items]
  }

  get updatedAt(): Date {
    return this._updatedAt
  }

  // Business methods that generate events
  confirm(): void {
    if (this._status !== OrderStatus.PENDING) {
      throw new Error('Only pending orders can be confirmed')
    }

    this._status = OrderStatus.CONFIRMED
    this._updatedAt = new Date()

    this.addEvent({
      id: this.generateEventId(),
      type: 'order.confirmed',
      aggregateId: this.id,
      aggregateType: 'Order',
      eventData: {
        orderId: this.id,
        customerId: this.customerId,
        totalAmount: this._totalAmount,
        confirmedAt: this._updatedAt
      },
      version: this.getNextVersion(),
      occurredAt: new Date()
    })
  }

  cancel(reason: string): void {
    if (this._status === OrderStatus.CANCELLED) {
      throw new Error('Order is already cancelled')
    }

    if (this._status === OrderStatus.SHIPPED) {
      throw new Error('Cannot cancel shipped order')
    }

    this._status = OrderStatus.CANCELLED
    this._updatedAt = new Date()

    this.addEvent({
      id: this.generateEventId(),
      type: 'order.cancelled',
      aggregateId: this.id,
      aggregateType: 'Order',
      eventData: {
        orderId: this.id,
        customerId: this.customerId,
        reason,
        cancelledAt: this._updatedAt
      },
      version: this.getNextVersion(),
      occurredAt: new Date()
    })
  }

  addItem(productId: string, quantity: number, price: number): void {
    if (this._status !== OrderStatus.PENDING) {
      throw new Error('Cannot modify confirmed order')
    }

    const existingItem = this._items.find(item => item.productId === productId)
    
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      this._items.push({
        productId,
        quantity,
        price,
        totalPrice: quantity * price
      })
    }

    this.recalculateTotal()
    this._updatedAt = new Date()

    this.addEvent({
      id: this.generateEventId(),
      type: 'order.item_added',
      aggregateId: this.id,
      aggregateType: 'Order',
      eventData: {
        orderId: this.id,
        productId,
        quantity,
        price,
        newTotal: this._totalAmount
      },
      version: this.getNextVersion(),
      occurredAt: new Date()
    })
  }

  // Event sourcing methods
  getUncommittedEvents(): DomainEvent[] {
    return [...this.events]
  }

  markEventsAsCommitted(): void {
    this.events = []
  }

  // Factory method for event sourcing
  static fromEvents(events: DomainEvent[]): Order {
    if (events.length === 0) {
      throw new Error('Cannot create order from empty events')
    }

    const firstEvent = events[0]
    const order = new Order(
      firstEvent.aggregateId,
      firstEvent.eventData.customerId,
      firstEvent.eventData.tenantId,
      OrderStatus.PENDING,
      0,
      []
    )

    // Apply all events
    for (const event of events) {
      order.applyEvent(event)
    }

    return order
  }

  private applyEvent(event: DomainEvent): void {
    switch (event.type) {
      case 'order.created':
        this._status = OrderStatus.PENDING
        this._totalAmount = event.eventData.totalAmount
        this._items = event.eventData.items
        break
      case 'order.confirmed':
        this._status = OrderStatus.CONFIRMED
        break
      case 'order.cancelled':
        this._status = OrderStatus.CANCELLED
        break
      case 'order.item_added':
        this.addItem(
          event.eventData.productId,
          event.eventData.quantity,
          event.eventData.price
        )
        break
    }
  }

  private addEvent(event: DomainEvent): void {
    this.events.push(event)
  }

  private recalculateTotal(): void {
    this._totalAmount = this._items.reduce((sum, item) => sum + item.totalPrice, 0)
  }

  private generateEventId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private getNextVersion(): number {
    return this.events.length + 1
  }
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered'
}

export interface OrderItem {
  productId: string
  quantity: number
  price: number
  totalPrice: number
}



