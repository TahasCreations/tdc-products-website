import { prisma } from "@/lib/prisma";

// Rate limiting için basit in-memory cache
const clickCache = new Map<string, { count: number; timestamp: number }>();

export async function serveAdsForQuery(query: string, k = 3) {
  if (!query) return [];
  const kw = query.toLowerCase();
  
  const campaigns = await prisma.adCampaign.findMany({
    where: { 
      status: "ACTIVE", 
      keywords: { contains: kw }
    },
    include: {
      adTargets: {
        include: {
          product: true
        }
      }
    },
    take: 50
  });
  
  // Bütçeyi aşmamış kampanyaları filtrele
  const activeCampaigns = campaigns.filter(c => {
    const remaining = Number(c.dailyBudget) - Number(c.spentToday);
    return remaining > 0;
  });
  
  // Ağırlıklı ürün seçimi
  const results = [];
  for (const campaign of activeCampaigns) {
    if (results.length >= k) break;
    
    const remaining = Number(campaign.dailyBudget) - Number(campaign.spentToday);
    const maxCpc = Math.min(Number(campaign.cpcMax), remaining);
    
    if (maxCpc <= 0) continue;
    
    // Ağırlıklı rastgele seçim
    const targets = campaign.adTargets;
    if (targets.length === 0) continue;
    
    const totalWeight = targets.reduce((sum, t) => sum + t.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const target of targets) {
      random -= target.weight;
      if (random <= 0) {
        results.push({
          campaignId: campaign.id,
          productId: target.productId,
          cpc: maxCpc,
          label: "Sponsorlu"
        });
        break;
      }
    }
  }
  
  return results.slice(0, k);
}

export function shouldRateLimitClick(campaignId: string, ip: string): boolean {
  const key = `${campaignId}:${ip}`;
  const now = Date.now();
  const thirtySecondsAgo = now - 30000;
  
  const cached = clickCache.get(key);
  
  if (!cached || cached.timestamp < thirtySecondsAgo) {
    clickCache.set(key, { count: 1, timestamp: now });
    return false; // İlk tıklama
  }
  
  if (cached.count >= 3) {
    return true; // Rate limit aşıldı
  }
  
  cached.count++;
  cached.timestamp = now;
  return false;
}

// Alias for backward compatibility
export const getAdsForQuery = serveAdsForQuery;
