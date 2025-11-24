/**
 * Post-Payment Processor
 * 
 * Handles all business logic after a successful payment:
 * 1. Stock update
 * 2. Commission calculation
 * 3. Payout record creation
 * 4. Email notifications
 * 5. Seller notifications
 */

import { prisma } from "@/lib/prisma";
import { sendOrderConfirmation, sendSellerNewOrder } from "@/src/lib/email";
import { updateStock } from "@/lib/stock/stock-manager";

interface PostPaymentData {
  orderId: string;
  orderNumber: string;
  paymentMethod: "PayTR" | "Iyzico";
}

interface ProcessResult {
  success: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Process all post-payment operations
 */
export async function processPostPayment(
  data: PostPaymentData,
): Promise<ProcessResult> {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    // 1. Get order with all necessary data
    const order = await prisma.order.findUnique({
      where: { orderNumber: data.orderNumber },
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                stock: true,
                sellerId: true,
              },
            },
            variantId: true,
          },
        },
      },
    });

    if (!order) {
      return {
        success: false,
        errors: ["Sipariş bulunamadı"],
        warnings: [],
      };
    }

    // 2. Update stock for each order item
    const stockResults = await updateStockForOrder(
      order.items.map(item => ({
        id: item.id,
        qty: item.qty,
        productId: item.productId,
        variantId: item.variantId || undefined,
        product: item.product,
      })),
      order.id
    );
    if (stockResults.errors.length > 0) {
      errors.push(...stockResults.errors);
    }
    if (stockResults.warnings.length > 0) {
      warnings.push(...stockResults.warnings);
    }

    // 3. Calculate commissions and create payout records
    const commissionResults = await processCommissions(order.items, order.id);
    if (commissionResults.errors.length > 0) {
      errors.push(...commissionResults.errors);
    }

    // 4. Send email notifications
    const emailResults = await sendNotifications(order, data.paymentMethod);
    if (emailResults.errors.length > 0) {
      warnings.push(...emailResults.errors); // Email errors are warnings, not critical
    }

    // 5. Send seller notifications
    const sellerNotificationResults = await notifySellers(order.items);
    if (sellerNotificationResults.errors.length > 0) {
      warnings.push(...sellerNotificationResults.errors);
    }

    return {
      success: errors.length === 0,
      errors,
      warnings,
    };
  } catch (error) {
    console.error("Post-payment processing error:", error);
    return {
      success: false,
      errors: [error instanceof Error ? error.message : "Bilinmeyen hata"],
      warnings: [],
    };
  }
}

/**
 * Update stock for order items
 */
async function updateStock(
  items: Array<{
    id: string;
    productId: string;
    qty: number;
    product: { id: string; title: string; stock: number };
  }>,
): Promise<{ errors: string[]; warnings: string[] }> {
  const errors: string[] = [];
  const warnings: string[] = [];

  for (const item of items) {
    try {
      const currentStock = item.product.stock;
      const newStock = currentStock - item.qty;

      if (newStock < 0) {
        errors.push(
          `Ürün "${item.product.title}" için yetersiz stok. Mevcut: ${currentStock}, İstenen: ${item.qty}`,
        );
        continue;
      }

      // Update stock
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: newStock },
      });

      // Check for low stock warning
      if (newStock < 10) {
        warnings.push(
          `Ürün "${item.product.title}" için düşük stok uyarısı: ${newStock} adet kaldı`,
        );
      }
    } catch (error) {
      errors.push(
        `Stok güncelleme hatası (Ürün ID: ${item.productId}): ${error instanceof Error ? error.message : "Bilinmeyen hata"}`,
      );
    }
  }

  return { errors, warnings };
}

/**
 * Process commissions and create payout records
 */
async function processCommissions(
  items: Array<{
    id: string;
    productId: string;
    sellerId: string;
    unitPrice: number;
    qty: number;
    subtotal: number;
  }>,
  orderId: string,
): Promise<{ errors: string[] }> {
  const errors: string[] = [];

  // Group items by seller
  const itemsBySeller = new Map<string, typeof items>();

  for (const item of items) {
    if (!itemsBySeller.has(item.sellerId)) {
      itemsBySeller.set(item.sellerId, []);
    }
    itemsBySeller.get(item.sellerId)!.push(item);
  }

  // Process each seller's items
  for (const [sellerId, sellerItems] of itemsBySeller) {
    try {
      // Get seller profile
      const seller = await prisma.sellerProfile.findUnique({
        where: { id: sellerId },
        select: {
          id: true,
          storeName: true,
          sellerType: true,
          taxNumber: true,
          userId: true,
        },
      });

      if (!seller) {
        errors.push(`Satıcı bulunamadı (ID: ${sellerId})`);
        continue;
      }

      // Calculate total amount for this seller
      const totalAmount = sellerItems.reduce(
        (sum, item) => sum + item.subtotal,
        0,
      );

      // Determine commission rate based on seller type
      // Default: 10% for individual, 7% for company
      const sellerType = seller.sellerType || "individual";
      const baseCommissionRate =
        sellerType === "company" ? 0.07 : 0.1; // 7% or 10%
      const taxRate = 0.18; // 18% KDV

      // Calculate commission
      const commissionAmount = totalAmount * baseCommissionRate;
      const taxAmount = commissionAmount * taxRate;
      const totalCommission = commissionAmount + taxAmount;
      const sellerAmount = totalAmount - totalCommission;

      // Create payout record
      await prisma.payout.create({
        data: {
          sellerId: seller.id,
          amount: sellerAmount,
          currency: "TRY",
          status: "scheduled",
          meta: {
            orderId,
            orderItemIds: sellerItems.map((item) => item.id),
            totalAmount,
            commissionRate: baseCommissionRate,
            commissionAmount,
            taxRate,
            taxAmount,
            totalCommission,
            sellerAmount,
            calculatedAt: new Date().toISOString(),
          },
        },
      });
    } catch (error) {
      errors.push(
        `Komisyon hesaplama hatası (Satıcı ID: ${sellerId}): ${error instanceof Error ? error.message : "Bilinmeyen hata"}`,
      );
    }
  }

  return { errors };
}

/**
 * Send email notifications
 */
async function sendNotifications(
  order: {
    id: string;
    orderNumber: string;
    total: number;
    user: { name: string | null; email: string | null } | null;
    items: Array<{ product: { title: string }; qty: number; unitPrice: number }>;
  },
  paymentMethod: string,
): Promise<{ errors: string[] }> {
  const errors: string[] = [];

  // Send order confirmation email to customer
  if (order.user?.email) {
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
      await sendOrderConfirmation(order.user.email, {
        customerName: order.user.name || "Değerli Müşteri",
        orderNumber: order.orderNumber,
        total: order.total,
        paymentMethod,
        orderUrl: `${baseUrl}/orders/${order.orderNumber}`,
        items: order.items.map((item) => ({
          name: item.product.title,
          title: item.product.title,
          quantity: item.qty,
          qty: item.qty,
          price: item.unitPrice,
        })),
      });
    } catch (error) {
      errors.push(
        `Müşteri email gönderim hatası: ${error instanceof Error ? error.message : "Bilinmeyen hata"}`,
      );
    }
  }

  return { errors };
}

/**
 * Notify sellers about new orders
 */
async function notifySellers(
  items: Array<{
    sellerId: string;
    product: { title: string };
    qty: number;
  }>,
): Promise<{ errors: string[] }> {
  const errors: string[] = [];

  // Group items by seller
  const itemsBySeller = new Map<
    string,
    Array<{ title: string; qty: number }>
  >();

  for (const item of items) {
    if (!itemsBySeller.has(item.sellerId)) {
      itemsBySeller.set(item.sellerId, []);
    }
    itemsBySeller.get(item.sellerId)!.push({
      title: item.product.title,
      qty: item.qty,
    });
  }

  // Notify each seller
  for (const [sellerId, sellerItems] of itemsBySeller) {
    try {
      const seller = await prisma.sellerProfile.findUnique({
        where: { id: sellerId },
        include: {
          user: { select: { email: true, name: true } },
        },
      });

      if (!seller?.user?.email) {
        continue; // Skip if no email
      }

      await sendSellerNewOrder(seller.user.email, {
        sellerName: seller.storeName,
        items: sellerItems,
        orderCount: sellerItems.length,
      });
    } catch (error) {
      errors.push(
        `Satıcı bildirim hatası (Satıcı ID: ${sellerId}): ${error instanceof Error ? error.message : "Bilinmeyen hata"}`,
      );
    }
  }

  return { errors };
}

