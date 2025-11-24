/**
 * Stock Management System
 * 
 * Handles:
 * - Stock updates with history tracking
 * - Stock reservations
 * - Low stock alerts
 * - Stock history logging
 */

import { prisma } from "@/lib/prisma";
import { sendLowStockAlert } from "@/src/lib/email";

export interface StockUpdateParams {
  productId: string;
  variantId?: string;
  quantity: number; // Pozitif = artış, Negatif = azalış
  type: 'increase' | 'decrease' | 'adjustment' | 'reservation' | 'release';
  reason?: string;
  referenceId?: string;
  referenceType?: 'order' | 'return' | 'adjustment' | 'manual';
  notes?: string;
  createdBy?: string;
}

export interface StockReservationParams {
  productId: string;
  variantId?: string;
  quantity: number;
  orderId?: string;
  expiresInMinutes?: number; // Rezervasyon süresi (dakika)
  metadata?: any;
}

/**
 * Update stock with history tracking
 */
export async function updateStock(params: StockUpdateParams): Promise<{
  success: boolean;
  previousStock: number;
  newStock: number;
  error?: string;
}> {
  try {
    // Get current stock
    const product = await prisma.product.findUnique({
      where: { id: params.productId },
      select: { stock: true, lowStockThreshold: true, title: true },
    });

    if (!product) {
      return {
        success: false,
        previousStock: 0,
        newStock: 0,
        error: 'Ürün bulunamadı',
      };
    }

    const previousStock = product.stock;
    const newStock = previousStock + params.quantity;

    // Check if stock would go negative
    if (newStock < 0) {
      return {
        success: false,
        previousStock,
        newStock: previousStock,
        error: `Yetersiz stok. Mevcut: ${previousStock}, İstenen: ${Math.abs(params.quantity)}`,
      };
    }

    // Update stock
    await prisma.product.update({
      where: { id: params.productId },
      data: { stock: newStock },
    });

    // Create stock history record
    await prisma.stockHistory.create({
      data: {
        productId: params.productId,
        variantId: params.variantId,
        type: params.type,
        quantity: params.quantity,
        previousStock,
        newStock,
        reason: params.reason,
        referenceId: params.referenceId,
        referenceType: params.referenceType,
        notes: params.notes,
        createdBy: params.createdBy,
      },
    });

    // Check for low stock alert
    if (newStock <= product.lowStockThreshold && newStock > 0) {
      await checkAndCreateLowStockAlert(params.productId, params.variantId, newStock, product.lowStockThreshold);
    }

    // Check for out of stock alert
    if (newStock === 0) {
      await checkAndCreateOutOfStockAlert(params.productId, params.variantId);
    }

    return {
      success: true,
      previousStock,
      newStock,
    };
  } catch (error) {
    console.error('Stock update error:', error);
    return {
      success: false,
      previousStock: 0,
      newStock: 0,
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
    };
  }
}

/**
 * Reserve stock for an order
 */
export async function reserveStock(params: StockReservationParams): Promise<{
  success: boolean;
  reservationId?: string;
  error?: string;
}> {
  try {
    // Get current available stock (total - reserved)
    const product = await prisma.product.findUnique({
      where: { id: params.productId },
      select: { stock: true },
    });

    if (!product) {
      return { success: false, error: 'Ürün bulunamadı' };
    }

    // Get reserved quantity
    const reservedQuantity = await prisma.stockReservation.aggregate({
      where: {
        productId: params.productId,
        variantId: params.variantId || null,
        status: { in: ['reserved', 'confirmed'] },
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } },
        ],
      },
      _sum: { quantity: true },
    });

    const availableStock = product.stock - (reservedQuantity._sum.quantity || 0);

    if (availableStock < params.quantity) {
      return {
        success: false,
        error: `Yetersiz stok. Mevcut: ${availableStock}, İstenen: ${params.quantity}`,
      };
    }

    // Create reservation
    const expiresAt = params.expiresInMinutes
      ? new Date(Date.now() + params.expiresInMinutes * 60 * 1000)
      : null;

    const reservation = await prisma.stockReservation.create({
      data: {
        productId: params.productId,
        variantId: params.variantId,
        orderId: params.orderId,
        quantity: params.quantity,
        status: 'reserved',
        expiresAt,
        metadata: params.metadata,
      },
    });

    return {
      success: true,
      reservationId: reservation.id,
    };
  } catch (error) {
    console.error('Stock reservation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
    };
  }
}

/**
 * Confirm reservation (convert to actual stock decrease)
 */
export async function confirmReservation(reservationId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const reservation = await prisma.stockReservation.findUnique({
      where: { id: reservationId },
      include: { product: true },
    });

    if (!reservation) {
      return { success: false, error: 'Rezervasyon bulunamadı' };
    }

    if (reservation.status !== 'reserved') {
      return { success: false, error: 'Rezervasyon onaylanamaz durumda' };
    }

    // Update stock
    const result = await updateStock({
      productId: reservation.productId,
      variantId: reservation.variantId || undefined,
      quantity: -reservation.quantity,
      type: 'decrease',
      reason: 'Reservation confirmed',
      referenceId: reservation.orderId || undefined,
      referenceType: 'order',
    });

    if (!result.success) {
      return { success: false, error: result.error };
    }

    // Update reservation status
    await prisma.stockReservation.update({
      where: { id: reservationId },
      data: { status: 'confirmed' },
    });

    return { success: true };
  } catch (error) {
    console.error('Reservation confirmation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
    };
  }
}

/**
 * Release reservation
 */
export async function releaseReservation(reservationId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    await prisma.stockReservation.update({
      where: { id: reservationId },
      data: { status: 'released' },
    });

    return { success: true };
  } catch (error) {
    console.error('Reservation release error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
    };
  }
}

/**
 * Check and create low stock alert
 */
async function checkAndCreateLowStockAlert(
  productId: string,
  variantId: string | null | undefined,
  currentStock: number,
  threshold: number
): Promise<void> {
  try {
    // Check if alert already exists and is not resolved
    const existingAlert = await prisma.stockAlert.findFirst({
      where: {
        productId,
        variantId: variantId || null,
        alertType: 'low_stock',
        isResolved: false,
      },
    });

    if (existingAlert) {
      // Update existing alert
      await prisma.stockAlert.update({
        where: { id: existingAlert.id },
        data: {
          currentStock,
          notifiedAt: null, // Reset to send new notification
        },
      });
    } else {
      // Create new alert
      await prisma.stockAlert.create({
        data: {
          productId,
          variantId: variantId || null,
          alertType: 'low_stock',
          currentStock,
          threshold,
        },
      });
    }
  } catch (error) {
    console.error('Low stock alert creation error:', error);
  }
}

/**
 * Check and create out of stock alert
 */
async function checkAndCreateOutOfStockAlert(
  productId: string,
  variantId: string | null | undefined
): Promise<void> {
  try {
    const existingAlert = await prisma.stockAlert.findFirst({
      where: {
        productId,
        variantId: variantId || null,
        alertType: 'out_of_stock',
        isResolved: false,
      },
    });

    if (!existingAlert) {
      await prisma.stockAlert.create({
        data: {
          productId,
          variantId: variantId || null,
          alertType: 'out_of_stock',
          currentStock: 0,
          threshold: 0,
        },
      });
    }
  } catch (error) {
    console.error('Out of stock alert creation error:', error);
  }
}

/**
 * Get stock history for a product
 */
export async function getStockHistory(
  productId: string,
  variantId?: string,
  limit: number = 50
) {
  return prisma.stockHistory.findMany({
    where: {
      productId,
      variantId: variantId || undefined,
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      product: {
        select: {
          title: true,
        },
      },
    },
  });
}

/**
 * Get low stock products
 */
export async function getLowStockProducts(threshold?: number) {
  return prisma.product.findMany({
    where: {
      stock: {
        lte: threshold || 10,
      },
      stock: {
        gt: 0,
      },
      isActive: true,
    },
    orderBy: {
      stock: 'asc',
    },
    include: {
      seller: {
        select: {
          displayName: true,
          email: true,
        },
      },
    },
  });
}

/**
 * Get out of stock products
 */
export async function getOutOfStockProducts() {
  return prisma.product.findMany({
    where: {
      stock: 0,
      isActive: true,
    },
    include: {
      seller: {
        select: {
          displayName: true,
          email: true,
        },
      },
    },
  });
}



