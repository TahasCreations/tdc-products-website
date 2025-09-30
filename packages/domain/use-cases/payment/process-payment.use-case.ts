import { PaymentPort, PaymentRequest, PaymentResult } from '../../ports/payment.port'
import { OrderRepository } from '../../ports/repositories/order.repository'
import { EventPublisher } from '../../ports/events/event.publisher'
import { Order } from '../../entities/order/order.entity'

export class ProcessPaymentUseCase {
  constructor(
    private paymentService: PaymentPort,
    private orderRepository: OrderRepository,
    private eventPublisher: EventPublisher
  ) {}

  async execute(request: PaymentRequest): Promise<PaymentResult> {
    // 1. Validate order exists and is payable
    const order = await this.orderRepository.findById(request.orderId)
    if (!order) {
      throw new Error('Order not found')
    }

    if (order.status !== 'pending_payment') {
      throw new Error('Order is not in payable state')
    }

    // 2. Validate payment amount matches order total
    if (order.totalAmount !== request.amount) {
      throw new Error('Payment amount does not match order total')
    }

    // 3. Process payment through payment service
    const paymentResult = await this.paymentService.processPayment(request)

    // 4. Update order status based on payment result
    if (paymentResult.success) {
      order.status = 'payment_pending'
      order.paymentTransactionId = paymentResult.transactionId
      await this.orderRepository.save(order)

      // 5. Publish payment initiated event
      await this.eventPublisher.publish('payment.initiated', {
        orderId: order.id,
        transactionId: paymentResult.transactionId,
        amount: request.amount,
        currency: request.currency
      })
    } else {
      order.status = 'payment_failed'
      await this.orderRepository.save(order)

      // Publish payment failed event
      await this.eventPublisher.publish('payment.failed', {
        orderId: order.id,
        reason: paymentResult.message
      })
    }

    return paymentResult
  }
}



