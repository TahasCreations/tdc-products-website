import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getSalesReport(sellerId: string, startDate: Date, endDate: Date) {
  return await prisma.ledgerEntry.findMany({
    where: {
      sellerId,
      type: { in: ["ORDER_PAID", "ORDER_REFUND"] },
      createdAt: {
        gte: startDate,
        lte: endDate
      }
    },
    orderBy: { createdAt: 'desc' }
  });
}

export async function getAdsReport(sellerId: string, startDate: Date, endDate: Date) {
  return await prisma.ledgerEntry.findMany({
    where: {
      sellerId,
      type: "AD_SPEND",
      createdAt: {
        gte: startDate,
        lte: endDate
      }
    },
    orderBy: { createdAt: 'desc' }
  });
}

export async function getPayoutsReport(sellerId: string, startDate: Date, endDate: Date) {
  return await prisma.ledgerEntry.findMany({
    where: {
      sellerId,
      type: "PAYOUT",
      createdAt: {
        gte: startDate,
        lte: endDate
      }
    },
    orderBy: { createdAt: 'desc' }
  });
}

export function generateCSV(data: any[], filename: string) {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
  ].join('\n');
  
  return `data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}`;
}
