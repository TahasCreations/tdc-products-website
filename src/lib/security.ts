// Enterprise-grade security utilities
export class SecurityManager {
  private static instance: SecurityManager;
  private rateLimitMap = new Map<string, { count: number; resetTime: number }>();
  private maxRequests = 100; // per minute
  private windowMs = 60 * 1000; // 1 minute

  private constructor() {
    this.startCleanupInterval();
  }

  static getInstance(): SecurityManager {
    if (!SecurityManager.instance) {
      SecurityManager.instance = new SecurityManager();
    }
    return SecurityManager.instance;
  }

  // Rate limiting
  isRateLimited(identifier: string): boolean {
    const now = Date.now();
    const record = this.rateLimitMap.get(identifier);

    if (!record) {
      this.rateLimitMap.set(identifier, { count: 1, resetTime: now + this.windowMs });
      return false;
    }

    if (now > record.resetTime) {
      record.count = 1;
      record.resetTime = now + this.windowMs;
      return false;
    }

    if (record.count >= this.maxRequests) {
      return true;
    }

    record.count++;
    return false;
  }

  // XSS protection
  sanitizeInput(input: string): string {
    if (typeof input !== 'string') return '';
    
    return input
      .replace(/[<>]/g, '') // Remove < and >
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  }

  // CSRF token generation
  generateCSRFToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // Validate CSRF token
  validateCSRFToken(token: string, storedToken: string): boolean {
    return token === storedToken && token.length === 64;
  }

  // SQL injection protection
  sanitizeSQLInput(input: string): string {
    if (typeof input !== 'string') return '';
    
    return input
      .replace(/['";]/g, '') // Remove quotes and semicolons
      .replace(/--/g, '') // Remove SQL comments
      .replace(/\/\*/g, '') // Remove block comments start
      .replace(/\*\//g, '') // Remove block comments end
      .replace(/union/gi, '') // Remove UNION
      .replace(/select/gi, '') // Remove SELECT
      .replace(/insert/gi, '') // Remove INSERT
      .replace(/update/gi, '') // Remove UPDATE
      .replace(/delete/gi, '') // Remove DELETE
      .replace(/drop/gi, '') // Remove DROP
      .trim();
  }

  // Input validation
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Secure random string generation
  generateSecureRandom(length: number = 32): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // Hash password (client-side, for demonstration)
  async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash), byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // Cleanup expired rate limit records
  private startCleanupInterval(): void {
    setInterval(() => {
      const now = Date.now();
      for (const [key, record] of this.rateLimitMap.entries()) {
        if (now > record.resetTime) {
          this.rateLimitMap.delete(key);
        }
      }
    }, 60000); // Cleanup every minute
  }

  // Get security stats
  getSecurityStats(): {
    activeRateLimits: number;
    totalRequests: number;
  } {
    const now = Date.now();
    let activeRateLimits = 0;
    let totalRequests = 0;

    for (const record of this.rateLimitMap.values()) {
      if (now <= record.resetTime) {
        activeRateLimits++;
        totalRequests += record.count;
      }
    }

    return {
      activeRateLimits,
      totalRequests
    };
  }
}

// React hook for security
export function useSecurity() {
  const security = SecurityManager.getInstance();
  
  return {
    isRateLimited: (identifier: string) => security.isRateLimited(identifier),
    sanitizeInput: (input: string) => security.sanitizeInput(input),
    sanitizeSQLInput: (input: string) => security.sanitizeSQLInput(input),
    validateEmail: (email: string) => security.validateEmail(email),
    validatePassword: (password: string) => security.validatePassword(password),
    generateCSRFToken: () => security.generateCSRFToken(),
    validateCSRFToken: (token: string, storedToken: string) => 
      security.validateCSRFToken(token, storedToken),
    generateSecureRandom: (length?: number) => security.generateSecureRandom(length),
    hashPassword: (password: string) => security.hashPassword(password),
    getSecurityStats: () => security.getSecurityStats()
  };
}
