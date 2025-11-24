/**
 * Bank Transfer (Havale/EFT) Payment Handler
 * 
 * Havale/EFT ödeme işlemlerini yönetir
 */

import { prisma } from "@/lib/prisma";
import { sendBankTransferInstructions, sendPaymentReminder } from "@/src/lib/email";

interface CreateBankTransferPaymentData {
  orderId: string;
  userId: string;
  amount: number;
  currency?: string;
  expiresInDays?: number; // Ödeme son tarihi (varsayılan 3 gün)
}

interface VerifyBankTransferPaymentData {
  transactionId: string;
  reference: string; // Havale/EFT referans numarası
  receiptUrl?: string; // Makbuz/fiş URL'i
  verifiedBy: string; // Admin user ID
}

/**
 * Create bank transfer payment transaction
 */
export async function createBankTransferPayment(
  data: CreateBankTransferPaymentData,
): Promise<{ success: boolean; transactionId?: string; errors?: string[] }> {
  try {
    // Order'ı kontrol et
    const order = await prisma.order.findUnique({
      where: { id: data.orderId },
      include: {
        user: { select: { name: true, email: true } },
      },
    });

    if (!order) {
      return {
        success: false,
        errors: ["Sipariş bulunamadı"],
      };
    }

    // Zaten bir payment transaction var mı kontrol et
    const existingTransaction = await prisma.paymentTransaction.findUnique({
      where: { orderId: data.orderId },
    });

    if (existingTransaction) {
      return {
        success: false,
        errors: ["Bu sipariş için zaten bir ödeme işlemi mevcut"],
      };
    }

    // Ödeme son tarihini hesapla
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (data.expiresInDays || 3));

    // Payment transaction oluştur
    const transaction = await prisma.paymentTransaction.create({
      data: {
        orderId: data.orderId,
        orderNumber: order.orderNumber,
        userId: data.userId,
        paymentMethod: 'bank_transfer',
        amount: data.amount,
        currency: data.currency || 'TRY',
        status: 'pending',
        expiresAt,
      },
    });

    // Order status'u güncelle
    await prisma.order.update({
      where: { id: data.orderId },
      data: { status: 'pending' }, // Ödeme bekleniyor
    });

    // Havale/EFT talimatları email'i gönder
    if (order.user?.email) {
      try {
        const bankAccounts = await prisma.bankAccount.findMany({
          where: { isActive: true },
          orderBy: [{ isDefault: 'desc' }, { displayOrder: 'asc' }],
        });

        await sendBankTransferInstructions(order.user.email, {
          customerName: order.user.name || "Değerli Müşteri",
          orderNumber: order.orderNumber,
          amount: data.amount,
          currency: data.currency || 'TRY',
          reference: transaction.id.substring(0, 8).toUpperCase(),
          expiresAt: expiresAt.toISOString(),
          bankAccounts: bankAccounts.map(account => ({
            bankName: account.bankName,
            accountName: account.accountName,
            iban: account.iban,
            accountNumber: account.accountNumber || '',
            branchName: account.branchName || '',
          })),
        });
      } catch (emailError) {
        console.error("Havale/EFT talimatları email gönderim hatası:", emailError);
        // Email hatası transaction'ı etkilemesin
      }
    }

    return {
      success: true,
      transactionId: transaction.id,
    };
  } catch (error) {
    console.error("Bank transfer payment creation error:", error);
    return {
      success: false,
      errors: [error instanceof Error ? error.message : "Bilinmeyen hata"],
    };
  }
}

/**
 * Verify bank transfer payment
 */
export async function verifyBankTransferPayment(
  data: VerifyBankTransferPaymentData,
): Promise<{ success: boolean; errors?: string[] }> {
  try {
    // Transaction'ı bul
    const transaction = await prisma.paymentTransaction.findUnique({
      where: { id: data.transactionId },
      include: {
        order: {
          include: {
            user: { select: { name: true, email: true } },
          },
        },
      },
    });

    if (!transaction) {
      return {
        success: false,
        errors: ["Ödeme işlemi bulunamadı"],
      };
    }

    if (transaction.status !== 'pending') {
      return {
        success: false,
        errors: ["Bu ödeme işlemi zaten işlenmiş"],
      };
    }

    // Transaction'ı onayla
    await prisma.paymentTransaction.update({
      where: { id: data.transactionId },
      data: {
        status: 'verified',
        reference: data.reference,
        receiptUrl: data.receiptUrl,
        verifiedBy: data.verifiedBy,
        verifiedAt: new Date(),
      },
    });

    // Order'ı ödendi olarak işaretle
    await prisma.order.update({
      where: { id: transaction.orderId },
      data: {
        status: 'paid',
        paymentRef: `BANK_${data.reference}`,
      },
    });

    // Post-payment processing (stok güncelleme, komisyon hesaplama, vb.)
    try {
      const { processPostPayment } = await import("@/lib/post-payment-processor");
      await processPostPayment(transaction.orderId);
    } catch (postPaymentError) {
      console.error("Post-payment processing error:", postPaymentError);
      // Hata durumunda devam et, kritik değil
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Bank transfer payment verification error:", error);
    return {
      success: false,
      errors: [error instanceof Error ? error.message : "Bilinmeyen hata"],
    };
  }
}

/**
 * Reject bank transfer payment
 */
export async function rejectBankTransferPayment(
  transactionId: string,
  reason: string,
  rejectedBy: string,
): Promise<{ success: boolean; errors?: string[] }> {
  try {
    const transaction = await prisma.paymentTransaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction) {
      return {
        success: false,
        errors: ["Ödeme işlemi bulunamadı"],
      };
    }

    await prisma.paymentTransaction.update({
      where: { id: transactionId },
      data: {
        status: 'rejected',
        rejectionReason: reason,
        verifiedBy: rejectedBy,
        verifiedAt: new Date(),
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Bank transfer payment rejection error:", error);
    return {
      success: false,
      errors: [error instanceof Error ? error.message : "Bilinmeyen hata"],
    };
  }
}

/**
 * Send payment reminder email
 */
export async function sendPaymentReminderEmail(
  transactionId: string,
): Promise<{ success: boolean; errors?: string[] }> {
  try {
    const transaction = await prisma.paymentTransaction.findUnique({
      where: { id: transactionId },
      include: {
        order: {
          include: {
            user: { select: { name: true, email: true } },
          },
        },
      },
    });

    if (!transaction || !transaction.order.user?.email) {
      return {
        success: false,
        errors: ["Ödeme işlemi veya kullanıcı bulunamadı"],
      };
    }

    if (transaction.status !== 'pending') {
      return {
        success: false,
        errors: ["Bu ödeme işlemi beklenen durumda değil"],
      };
    }

    // Banka hesaplarını al
    const bankAccounts = await prisma.bankAccount.findMany({
      where: { isActive: true },
      orderBy: [{ isDefault: 'desc' }, { displayOrder: 'asc' }],
    });

    // Hatırlatma email'i gönder
    await sendPaymentReminder(transaction.order.user.email, {
      customerName: transaction.order.user.name || "Değerli Müşteri",
      orderNumber: transaction.orderNumber,
      amount: transaction.amount,
      currency: transaction.currency,
      reference: transaction.id.substring(0, 8).toUpperCase(),
      expiresAt: transaction.expiresAt?.toISOString() || '',
      bankAccounts: bankAccounts.map(account => ({
        bankName: account.bankName,
        accountName: account.accountName,
        iban: account.iban,
        accountNumber: account.accountNumber || '',
        branchName: account.branchName || '',
      })),
    });

    // Hatırlatma tarihini güncelle
    await prisma.paymentTransaction.update({
      where: { id: transactionId },
      data: {
        reminderSentAt: new Date(),
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Payment reminder email error:", error);
    return {
      success: false,
      errors: [error instanceof Error ? error.message : "Bilinmeyen hata"],
    };
  }
}

/**
 * Check and expire old pending payments
 */
export async function expireOldPayments(): Promise<number> {
  try {
    const now = new Date();
    
    const result = await prisma.paymentTransaction.updateMany({
      where: {
        status: 'pending',
        expiresAt: {
          lt: now,
        },
      },
      data: {
        status: 'expired',
      },
    });

    // Expired payment'ların order'larını iptal et
    const expiredTransactions = await prisma.paymentTransaction.findMany({
      where: {
        status: 'expired',
        expiresAt: {
          lt: now,
        },
      },
      select: { orderId: true },
    });

    for (const transaction of expiredTransactions) {
      await prisma.order.update({
        where: { id: transaction.orderId },
        data: { status: 'cancelled' },
      });
    }

    return result.count;
  } catch (error) {
    console.error("Expire old payments error:", error);
    return 0;
  }
}



