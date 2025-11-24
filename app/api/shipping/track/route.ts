import { NextResponse } from "next/server";
import { getShippingManager } from "@/lib/shipping/shipping-manager";
import { z } from "zod";

const trackSchema = z.object({
  trackingNumber: z.string().min(1),
  carrierCode: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = trackSchema.parse(body);

    const shippingManager = getShippingManager();
    
    const trackingInfo = await shippingManager.track(
      validatedData.trackingNumber,
      validatedData.carrierCode,
    );

    if (!trackingInfo) {
      return NextResponse.json(
        { error: "Kargo takip bilgisi bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      tracking: {
        trackingNumber: trackingInfo.trackingNumber,
        status: trackingInfo.status,
        events: trackingInfo.events.map(event => ({
          date: event.date.toISOString(),
          location: event.location,
          description: event.description,
          status: event.status,
        })),
        estimatedDelivery: trackingInfo.estimatedDelivery?.toISOString(),
        carrier: trackingInfo.carrier,
      },
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Geçersiz veri", details: error.errors },
        { status: 400 }
      );
    }

    console.error('Kargo takip hatası:', error);
    return NextResponse.json(
      {
        error: "Kargo takip bilgisi alınamadı",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
