// Basit in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(ip: string, limit: number = 60, windowMs: number = 60000): boolean {
  const now = Date.now();
  const key = ip;
  
  const current = rateLimitMap.get(key);
  
  if (!current || now > current.resetTime) {
    // İlk istek veya window süresi dolmuş
    rateLimitMap.set(key, {
      count: 1,
      resetTime: now + windowMs
    });
    return true; // İzin ver
  }
  
  if (current.count >= limit) {
    return false; // Rate limit aşıldı
  }
  
  // Sayacı artır
  current.count++;
  return true; // İzin ver
}

export function getRateLimitHeaders(ip: string, limit: number = 60, windowMs: number = 60000) {
  const current = rateLimitMap.get(ip);
  const remaining = current ? Math.max(0, limit - current.count) : limit;
  const resetTime = current?.resetTime || Date.now() + windowMs;
  
  return {
    'X-RateLimit-Limit': limit.toString(),
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': Math.ceil(resetTime / 1000).toString()
  };
}
