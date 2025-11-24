/**
 * Return Refund Processor
 * 
 * İade onaylandığında otomatik ödeme iade işlemini yönetir
 */

import { prisma } from "@/lib/prisma";
import { sendRefundNotification } from "@/src/lib/email";

interface ProcessRefundData {
  returnRequestId: string;
  refundAmount: number;
  refundMethod: 'original' | 'store_credit' | 'bank_transfer';
  orderId: string;
  paymentRef?: string;
}

interface ProcessRefundResult {
  success: boolean;
  refundId?: string;
  errors: string[];
  warnings: string[];
}

/**
 * Process refund for a return request
 */
export async function processRefund(
  data: ProcessRefundData,
): Promise<ProcessRefundResult> {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    // Get return request and order
    const returnRequest = await prisma.returnRequest.findUnique({
      where: { id: data.returnRequestId },
      include: {
        order: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });

    if (!returnRequest) {
      return {
        success: false,
        errors: ["İade talebi bulunamadı"],
        warnings: [],
      };
    }

    // Process refund based on method
    switch (data.refundMethod) {
      case 'original':
        // Orijinal ödeme yöntemine iade
        await processOriginalRefund(returnRequest.order, data, errors);
        break;
      case 'store_credit':
        // Mağaza kredisi olarak iade
        await processStoreCreditRefund(returnRequest.order.userId, data, errors);
        break;
      case 'bank_transfer':
        // Banka havalesi ile iade
        await processBankTransferRefund(returnRequest.order, data, errors);
        break;
    }

    // Update return request status
    if (errors.length === 0) {
      await prisma.returnRequest.update({
        where: { id: data.returnRequestId },
        data: {
          status: 'processing',
          refundAmount: data.refundAmount,
          refundMethod: data.refundMethod,
          processedAt: new Date(),
        },
      });

      // Send refund notification email
      if (returnRequest.order.user?.email) {
        try {
          await sendRefundNotification(returnRequest.order.user.email, {
            customerName: returnRequest.order.user.name || "Değerli Müşteri",
            orderNumber: returnRequest.order.orderNumber,
            refundAmount: data.refundAmount,
            refundMethod: data.refundMethod,
            returnRequestId: data.returnRequestId,
          });
        } catch (emailError) {
          warnings.push(
            `Email gönderim hatası: ${emailError instanceof Error ? emailError.message : "Bilinmeyen hata"}`,
          );
        }
      }
    }

    return {
      success: errors.length === 0,
      errors,
      warnings,
    };
  } catch (error) {
    console.error("Refund processing error:", error);
    return {
      success: false,
      errors: [error instanceof Error ? error.message : "Bilinmeyen hata"],
      warnings: [],
    };
  }
}

/**
 * Process refund to original payment method
 */
async function processOriginalRefund(
  order: { paymentRef?: string | null; paymentMethod?: string | null },
  data: ProcessRefundData,
  errors: string[],
): Promise<void> {
  if (!order.paymentRef) {
    errors.push("Ödeme referansı bulunamadı");
    return;
  }

  try {
    // Determine payment provider from payment method or paymentRef format
    const paymentMethod = order.paymentMethod || 'credit';
    
    if (paymentMethod === 'credit' || order.paymentRef.startsWith('IYZ')) {
      // Iyzico refund
      const { IyzicoService } = await import("@/src/lib/iyzico");
      const iyzico = new IyzicoService();
      
      const refundResult = await iyzico.refundPayment(
        order.paymentRef,
        data.refundAmount,
      );

      if (!refundResult.success) {
        errors.push(
          `Iyzico iade hatası: ${refundResult.errorMessage || "Bilinmeyen hata"}`,
        );
      }
    } else if (order.paymentRef.startsWith('PAYTR')) {
      // PayTR refund (if supported)
      // PayTR genellikle manuel iade gerektirir
      errors.push("PayTR iadesi manuel olarak yapılmalıdır");
    } else {
      errors.push("Desteklenmeyen ödeme yöntemi");
    }
  } catch (error) {
    errors.push(
      `Ödeme iadesi hatası: ${error instanceof Error ? error.message : "Bilinmeyen hata"}`,
    );
  }
}

/**
 * Process refund as store credit
 */
async function processStoreCreditRefund(
  userId: string,
  data: ProcessRefundData,
  errors: string[],
): Promise<void> {
  try {
    // Get or create loyalty points for user
    let loyaltyPoints = await prisma.loyaltyPoints.findUnique({
      where: { userId },
    });

    if (!loyaltyPoints) {
      loyaltyPoints = await prisma.loyaltyPoints.create({
        data: {
          userId,
          points: 0,
          level: "Bronze",
          tier: 1,
        },
      });
    }

    // Convert refund amount to points (1 TL = 10 points)
    const pointsToAdd = Math.floor(data.refundAmount * 10);

    // Add points
    await prisma.loyaltyPoints.update({
      where: { id: loyaltyPoints.id },
      data: {
        points: loyaltyPoints.points + pointsToAdd,
        totalEarned: loyaltyPoints.totalEarned + pointsToAdd,
      },
    });

    // Create transaction record
    await prisma.loyaltyTransaction.create({
      data: {
        userId,
        loyaltyId: loyaltyPoints.id,
        points: pointsToAdd,
        type: "earn",
        reason: "return_refund",
        metadata: {
          returnRequestId: data.returnRequestId,
          refundAmount: data.refundAmount,
        },
      },
    });
  } catch (error) {
    errors.push(
      `Mağaza kredisi iadesi hatası: ${error instanceof Error ? error.message : "Bilinmeyen hata"}`,
    );
  }
}

/**
 * Process refund via bank transfer
 */
async function processBankTransferRefund(
  order: { customerInfo?: any },
  data: ProcessRefundData,
  errors: string[],
): Promise<void> {
  // Bank transfer requires manual processing
  // Just log the refund request
  try {
    // Create a payout record for manual processing
    await prisma.payout.create({
      data: {
        sellerId: null, // Platform payout
        amount: data.refundAmount,
        currency: "TRY",
        status: "scheduled",
        meta: {
          type: "refund",
          returnRequestId: data.returnRequestId,
          orderId: data.orderId,
          customerInfo: order.customerInfo,
          method: "bank_transfer",
          requiresManualProcessing: true,
        },
      },
    });
  } catch (error) {
    errors.push(
      `Banka havalesi kaydı hatası: ${error instanceof Error ? error.message : "Bilinmeyen hata"}`,
    );
  }
}

/**
 * Complete refund process (mark as completed)
 */
export async function completeRefund(returnRequestId: string): Promise<void> {
  await prisma.returnRequest.update({
    where: { id: returnRequestId },
    data: {
      status: 'completed',
      completedAt: new Date(),
    },
  });

  // Update order status if all items are returned
  const returnRequest = await prisma.returnRequest.findUnique({
    where: { id: returnRequestId },
    include: {
      order: {
        include: {
          items: true,
          returnRequests: true,
        },
      },
    },
  });

  if (returnRequest) {
    const allItemsReturned = returnRequest.order.items.every((item) => {
      const itemReturn = returnRequest.order.returnRequests.find(
        (rr) => rr.orderItemId === item.id && rr.status === 'completed',
      );
      return itemReturn !== undefined;
    });

    if (allItemsReturned) {
      await prisma.order.update({
        where: { id: returnRequest.order.id },
        data: { status: 'refunded' },
      });
    }
  }
}



