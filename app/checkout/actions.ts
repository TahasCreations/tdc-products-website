'use server';

import { PrismaClient } from '@prisma/client';
import { requireUser } from '../../src/lib/guards';

const prisma = new PrismaClient();

export async function createOrder(orderData: {
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
    sellerId: string;
  }>;
  totalAmount: number;
  currency: string;
  shippingAddress: any;
  billingAddress: any;
}) {
  const user = await requireUser();
  
  // Create order with items
  const order = await prisma.order.create({
    data: {
      userId: user.id as string,
      status: 'PENDING',
      totalAmount: orderData.totalAmount,
      currency: orderData.currency,
      shippingAddress: orderData.shippingAddress,
      billingAddress: orderData.billingAddress,
      items: {
        create: orderData.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          sellerId: item.sellerId,
        }))
      }
    },
    include: {
      items: true
    }
  });

  return order;
}

export async function updateOrderStatus(orderId: string, status: string) {
  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status }
  });

  return order;
}

export async function handlePaymentSuccess(paymentData: any) {
  // Handle successful payment
  console.log('Payment successful:', paymentData);
  return { success: true };
}

export async function handlePaymentCancelled(paymentData: any) {
  // Handle cancelled payment
  console.log('Payment cancelled:', paymentData);
  return { success: true };
}