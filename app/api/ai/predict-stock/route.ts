export const runtime = "nodejs";
import { NextRequest } from "next/server";
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { productId, currentStock } = await req.json();

    // Get historical sales data
    const recentOrders = await prisma.order.findMany({
      where: {
        status: { in: ['COMPLETED', 'SHIPPED', 'DELIVERED'] },
        items: {
          some: { productId },
        },
      },
      include: {
        items: {
          where: { productId },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 90, // Last 90 days
    });

    // Calculate average daily sales
    const salesData = recentOrders.map(order => {
      const item = order.items.find(i => i.productId === productId);
      return {
        date: order.createdAt,
        quantity: item?.quantity || 0,
      };
    });

    // Group by days and calculate daily average
    const daysOfData = new Date().getTime() - new Date(salesData[salesData.length - 1]?.date).getTime();
    const totalDays = Math.max(1, Math.floor(daysOfData / (1000 * 60 * 60 * 24)));
    const totalQuantity = salesData.reduce((sum, s) => sum + s.quantity, 0);
    const averageDailySales = totalQuantity / totalDays;

    // Adjust for seasonality/trends (simplified)
    const recentDays = totalDays <= 7 ? totalDays : 7;
    const recentQuantity = salesData.slice(0, recentDays * 5).reduce((sum, s) => sum + s.quantity, 0);
    const recentAverage = recentQuantity / recentDays;
    
    // Use recent average if significantly different (trend detection)
    const demandForecast = recentAverage > averageDailySales * 1.2 
      ? recentAverage 
      : averageDailySales;

    // Predict depletion
    const predictedDepletion = currentStock > 0 
      ? Math.floor(currentStock / Math.max(1, demandForecast))
      : 0;

    // Calculate urgency
    let urgency: 'low' | 'medium' | 'high' | 'critical' = 'low';
    if (currentStock === 0) {
      urgency = 'critical';
    } else if (predictedDepletion <= 2) {
      urgency = 'critical';
    } else if (predictedDepletion <= 7) {
      urgency = 'high';
    } else if (predictedDepletion <= 14) {
      urgency = 'medium';
    } else {
      urgency = 'low';
    }

    // Restock recommendation (enough for 30 days with safety margin)
    const restockRecommendation = Math.ceil(demandForecast * 30 * 1.2);

    // Confidence based on data quality
    const confidence = Math.min(100, Math.max(60, 
      totalDays >= 90 ? 95 
      : totalDays >= 30 ? 85 
      : totalDays >= 7 ? 75 
      : 65
    ));

    return Response.json({
      success: true,
      prediction: {
        currentStock,
        predictedDepletion,
        demandForecast: Math.max(0.1, demandForecast),
        restockRecommendation,
        urgency,
        confidence,
      },
    });
  } catch (error) {
    console.error('Stock prediction error:', error);
    return Response.json(
      { success: false, error: 'Failed to predict stock' },
      { status: 500 }
    );
  }
}


