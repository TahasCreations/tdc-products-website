import { prisma } from "@/lib/prisma";
import { verifyPayTRCallback } from "@/lib/payments/paytr";
import { sendPaymentSuccess } from "@/src/lib/email";

export const runtime = "nodejs";

function getFormValue(form: FormData, key: string): string | null {
  const value = form.get(key);
  if (typeof value !== "string") {
    return null;
  }
  return value;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const merchantOid = getFormValue(formData, "merchant_oid");
    const status = getFormValue(formData, "status");
    const totalAmount = getFormValue(formData, "total_amount");
    const hash = getFormValue(formData, "hash");

    if (!merchantOid || !status || !totalAmount || !hash) {
      return new Response("FAIL", { status: 400 });
    }

    const isValid = verifyPayTRCallback({
      merchantOid,
      status,
      totalAmount,
      hash,
    });

    if (!isValid) {
      return new Response("FAIL", { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { orderNumber: merchantOid },
      include: {
        user: { select: { name: true, email: true } },
      },
    });

    if (!order) {
      return new Response("OK");
    }

    const paid = status === "success";
    const newStatus = paid ? "paid" : "failed";

    await prisma.order.update({
      where: { orderNumber: merchantOid },
      data: {
        status: newStatus,
        paymentRef: hash,
      },
    });

    // Process post-payment operations (stock, commission, payout, emails)
    if (paid) {
      try {
        const { processPostPayment } = await import("@/lib/post-payment-processor");
        const result = await processPostPayment({
          orderId: order.id,
          orderNumber: merchantOid,
          paymentMethod: "PayTR",
        });

        if (!result.success) {
          console.error("Post-payment processing errors:", result.errors);
        }
        if (result.warnings.length > 0) {
          console.warn("Post-payment processing warnings:", result.warnings);
        }
      } catch (postPaymentError) {
        console.error("Post-payment processing failed:", postPaymentError);
        // Don't fail the callback if post-payment processing fails
        // The payment is already recorded, we can retry later
      }
    }

    return new Response("OK");
  } catch (error) {
    console.error("PayTR callback error:", error);
    return new Response("FAIL", { status: 500 });
  }
}



