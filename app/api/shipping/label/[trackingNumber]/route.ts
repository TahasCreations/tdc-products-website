import { NextResponse } from "next/server";
import { getShippingManager } from "@/lib/shipping/shipping-manager";
import { z } from "zod";

export async function GET(
  req: Request,
  { params }: { params: { trackingNumber: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const carrierCode = searchParams.get('carrier');

    if (!carrierCode) {
      return NextResponse.json(
        { error: "Kargo firması kodu gerekli" },
        { status: 400 }
      );
    }

    const shippingManager = getShippingManager();
    
    const label = await shippingManager.getLabel(
      params.trackingNumber,
      carrierCode,
    );

    if (!label) {
      return NextResponse.json(
        { error: "Kargo etiketi bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      label: {
        trackingNumber: label.trackingNumber,
        labelUrl: label.labelUrl,
        barcodeUrl: label.barcodeUrl,
        expiresAt: label.expiresAt?.toISOString(),
      },
    });

  } catch (error) {
    console.error('Kargo etiket hatası:', error);
    return NextResponse.json(
      {
        error: "Kargo etiketi alınamadı",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}



